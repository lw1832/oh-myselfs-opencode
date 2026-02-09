# 打包拷贝内网 + 内网一键安装（含 npx）脑暴方案

目标：将当前项目**编译打包**成可拷贝到内网的产物，在内网通过**一条命令**（理想情况是 `npx oh-my-opencode install`）完成安装，无需内网访问 npm registry 或 Bun。

---

## 一、现状与障碍

### 1.1 当前 `oh-my-opencode install` 会联网的地方

| 环节 | 位置 | 行为 |
|------|------|------|
| 解析插件名 | `config-manager.ts` → `getPluginNameWithVersion()` | 调用 `fetchNpmDistTags("oh-my-opencode")` 访问 registry.npmjs.org |
| 写入 opencode.json | `addPluginToOpenCodeConfig()` | 写入 `"oh-my-opencode@版本"` 或 `"oh-my-opencode@latest"` |
| OpenCode 加载插件 | 宿主行为 | 根据 plugin 数组解析包名时，通常会执行 `npm install` / `bun install` 拉取包，需要网络 |
| 添加 Auth 插件 | `addAuthPlugins()` | 可能调用 `fetchLatestVersion("opencode-antigravity-auth")` |
| 全局 bun install | `runBunInstall()` | 在配置目录执行 `bun install`，会从 registry 拉依赖 |

因此：**未改动的 install 在内网无法「一键」完成**，会因请求 registry 或执行 install 而失败。

### 1.2 为何直接写 `oh-my-opencode@3.1.11` 仍不够

即使不在 install 里请求 npm，只写 `"oh-my-opencode@3.1.11"`，**OpenCode 宿主**在加载插件时仍会按「包名」解析，一般会触发 `npm install oh-my-opencode@3.1.11` 或等价逻辑，内网无 registry 时会失败。  
所以内网可靠方式只能是：**opencode.json 里写 `file:///绝对路径/dist/index.js`**，让宿主直接加载本地目录，不经过 npm。

---

## 二、方案概览

| 方案 | 内网「一键」命令 | 需要改动的代码 | 打包形态 |
|------|------------------|----------------|----------|
| A. npx + file: 路径 | `npx file:./oh-my-opencode-3.1.11.tgz install --offline --plugin-path=.\package` | install 增加 --offline、--plugin-path；addPlugin 写 file:// | tgz + 解压目录 或 自解压包 |
| B. 离线安装脚本 | `.\install-offline.bat` 或 `node install-offline.js` | 同上；另加一个小脚本/入口 | 单目录：plugin + 脚本 + cache |
| C. 全局安装 + 命令名 | `npm install -g .\oh-my-opencode.tgz && oh-my-opencode install --offline` | install 支持 --offline，不写 file: 时写包名；宿主需能从全局 node_modules 解析 | tgz |
| D. 内网私有 registry | `npx oh-my-opencode install`（不变） | 无；内网部署 npm registry 并发布包 | 无需改代码，需基建 |

下面只展开 **A** 和 **B**（不依赖内网 registry、不依赖 OpenCode 支持「从全局安装的包名」解析）。

---

## 三、方案 A：npx + file: + --offline / --plugin-path

### 3.1 思路

- 内网拷贝的「包」里包含：**tgz** 和/或 **已解压的 plugin 目录**（含 `dist/index.js`、`node_modules`）。
- 内网执行**一条**命令，用 npx 运行**本地**包并传入「离线 + 插件路径」：
  - 例如：`npx file:./oh-my-opencode-3.1.11.tgz install --offline --plugin-path=D:\offline\oh-my-opencode`
  - 或：先把 tgz 解压到 `D:\offline\oh-my-opencode`，再执行  
    `npx file:D:/offline/oh-my-opencode install --offline --plugin-path=D:/offline/oh-my-opencode`
- 这样 **npx** 不访问 registry（用 `file:` 指向本地 tgz 或目录），**install** 在 --offline 下不请求 npm，并用 --plugin-path 让 opencode.json 写入 `file:///D:/offline/oh-my-opencode/dist/index.js`。

### 3.2 需要改的代码

1. **CLI install 子命令**
   - 新增选项：`--offline`、`--plugin-path <path>`（或 `--plugin-dir`）。
   - `--offline` 时：
     - 不调用 `fetchNpmDistTags` / `fetchLatestVersion`；
     - `getPluginNameWithVersion` 改为直接返回当前包版本或由调用方传入的 plugin 条目；
     - 若存在 Gemini 等需 auth 插件，可跳过 `addAuthPlugins` 或仅写入已缓存的版本，不拉取最新。
   - 当提供 `--plugin-path` 时：
     - `addPluginToOpenCodeConfig` 不再调用 `getPluginNameWithVersion`，而是写入 **file:** 形式的插件条目：  
       `file:///D:/offline/oh-my-opencode/dist/index.js`（对 path 做规范化与 URL 编码）。
   - 可选：`--offline` 时自动在生成的 `oh-my-opencode.json` 里加上 `experimental.disable_model_list_fetch: true`、`disabled_hooks: ["auto-update-checker"]`、`disabled_mcps: ["websearch","context7","grep_app"]`，避免后续再联网。

2. **config-manager**
   - `addPluginToOpenCodeConfig(currentVersion, options?)` 增加可选参数，例如 `pluginFileUrl?: string`。
   - 当 `pluginFileUrl` 存在时：直接将该字符串 push 到 `config.plugin`，不再调用 `getPluginNameWithVersion`。
   - 调用处（install.ts）在存在 `--plugin-path` 时，把该路径转为绝对路径并拼出 `file:///.../dist/index.js` 传入。

3. **打包与文档**
   - 打包产物：构建好的 **dist** + **package.json** + **node_modules**（或可内网 `npm install` 的依赖清单）+ 可选 **tgz**。
   - 文档中写明：内网解压到固定目录后，执行：  
     `npx file:D:/path/to/oh-my-opencode install --offline --plugin-path=D:/path/to/oh-my-opencode`  
     或使用项目提供的 `install-offline.bat` / `install-offline.ps1`（见方案 B）封装上述命令。

### 3.3 优点与代价

- **优点**：接近「一条 npx 命令」完成安装；不依赖 Bun；不依赖内网 registry。
- **代价**：命令里需要写 `file:...` 和 `--plugin-path`，不是单纯的 `npx oh-my-opencode install`；需要改 CLI 与 config-manager。

---

## 四、方案 B：自包含目录 + 离线安装脚本（真正一键）

### 4.1 思路

- **打包**：一个自包含目录，例如 `oh-my-opencode-offline/`，内含：
  - **plugin/**：完整插件（dist、bin、package.json、node_modules）；
  - **cache/**：预生成的 connected-providers、provider-models、可选 bin（rg、sg、comment-checker）；
  - **bun-windows/**（可选）：Bun 的 Windows 离线包；
  - **install-offline.bat**（或 install-offline.ps1）：唯一入口脚本。
- **脚本逻辑**（示例）：
  1. 解析当前目录绝对路径，得到 `PLUGIN_PATH`（例如 `D:\offline\oh-my-opencode-offline\plugin`）。
  2. 可选：若存在 `cache/`，拷贝到 `%LOCALAPPDATA%\oh-my-opencode` 等（见现有内网指南）。
  3. 调用本包自带的 Node 运行 CLI：  
     `node ".\plugin\node_modules\oh-my-opencode\bin\oh-my-opencode.js" install --offline --plugin-path=%PLUGIN_PATH%`  
     若未带 node_modules 则需先 `npm install` 或使用已打包好的可执行 CLI（见下）。
  4. 或：若希望用 npx，脚本内执行  
     `npx file:./plugin install --offline --plugin-path=%PLUGIN_PATH%`（前提是 plugin 目录为合法包且含 package.json）。
- 用户在内网：**拷贝整个目录 → 双击 install-offline.bat**（或在该目录打开终端执行一次），即完成安装。

### 4.2 与方案 A 的代码改动

- 与方案 A 相同：**install 支持 --offline 与 --plugin-path**，**addPluginToOpenCodeConfig 支持写入 file:**。
- 额外：在仓库或构建产物中提供 **install-offline.bat / install-offline.ps1** 模板，或在文档中给出可复制脚本，用占位符替换插件路径。

### 4.3 优点与代价

- **优点**：对用户是真正的「拷贝 + 一键运行脚本」，无需记 npx 参数；可顺带处理 cache、Bun 等。
- **代价**：需要维护脚本与打包目录结构；CLI 改动同方案 A。

---

## 五、方案 C：全局安装 + `oh-my-opencode install --offline`

### 5.1 思路

- 内网先：`npm install -g ./oh-my-opencode-3.1.11.tgz`（不访问 registry，用本地 tgz），再执行 `oh-my-opencode install --offline`。
- **install --offline**：不请求 npm；`addPluginToOpenCodeConfig` 写入 `"oh-my-opencode@3.1.11"`（不调 getPluginNameWithVersion 的 fetch）。
- **关键**：OpenCode 宿主在解析 `"oh-my-opencode@3.1.11"` 时，必须能解析到**已全局安装**的包（例如从全局 `node_modules` 或 NODE_PATH 加载），而**不再**发起 `npm install`。这一点依赖 OpenCode 的实现：若宿主总是通过 npm/bun 在配置目录安装 plugin，则此方案不可行；若宿主会查全局安装的包，则可行。

### 5.2 需要改的代码

- install：支持 `--offline`（不 fetch，写死 `oh-my-opencode@当前版本`）。
- 不写 file:，不新增 --plugin-path。
- 需验证 OpenCode 是否支持「插件仅来自全局安装」。

### 5.3 结论

- 在未确认 OpenCode 行为前，**不建议**把方案 C 作为唯一方案；可作为补充尝试（例如内网先 `npm install -g`，再 `oh-my-opencode install --offline`，若宿主仍拉 npm 再退回方案 A/B）。

---

## 六、方案 D：内网私有 npm Registry

- 在内网部署 Verdaccio 或其它 npm registry，将 `oh-my-opencode-3.1.11.tgz` 发布到该 registry。
- 内网机器配置 `npm config set registry http://内网-registry`。
- 之后直接执行 `npx oh-my-opencode install`，npx 从内网 registry 拉包，install 仍可能请求 registry（getPluginNameWithVersion 等），需在 install 侧做 --offline 或「内网 registry 可访问」的兼容。
- **优点**：最接近公网使用习惯。**代价**：需要维护内网 registry 与发布流程。

---

## 七、推荐实施顺序

1. **先做方案 A 的代码改动**（--offline、--plugin-path、addPluginToOpenCodeConfig 写 file:），并保证：
   - 打包产物为「可解压的 tgz 或目录」且内含 dist、package.json、node_modules（或依赖清单）。
   - 文档说明：内网解压后执行  
     `npx file:<解压路径> install --offline --plugin-path=<解压路径>`。
2. **再在打包产物中提供方案 B 的 install-offline 脚本**，用同一套 CLI 参数，实现「拷贝 + 一键」。
3. 若希望进一步接近「npx oh-my-opencode install」原句，再考虑方案 D（内网 registry）或方案 C（在确认 OpenCode 支持全局包解析后）。

---

## 八、打包形态小结（与现有 output 的衔接）

- **现有**：已有 `output/`（tgz、plugin 目录、cache、bun-windows 等）。
- **方案 A/B 下**：在 output 中增加：
  - **install-offline.bat** / **install-offline.ps1**：接收可选参数（如插件路径、是否写 file:），内部调用  
    `node <plugin路径>/node_modules/.../bin/oh-my-opencode.js install --offline --plugin-path=<plugin路径>`  
    或 `npx file:<plugin路径> install --offline --plugin-path=<plugin路径>`；
  - 或文档明确写出「内网一键」命令示例（含 npx file: 与 --plugin-path）。
- **编译打包**：与当前一致——有网环境构建、npm pack、拷贝 dist + package.json + node_modules（或 tgz）到 output；内网不再编译，只拷贝与执行 install。

这样即可在「不改 OpenCode 宿主」的前提下，通过**改插件 CLI + 打包与脚本**，实现「打包拷贝到内网 + 内网一条命令（npx file:... install --offline --plugin-path=... 或 脚本）一键安装」。
