# 内网无网络环境 · 离线一键安装指南

本文档采用**方案 B：自包含目录 + 离线安装脚本（真正一键）**思路，适用于内网无外网、无法访问 npm registry 的环境。目标：将「自包含目录」拷贝到内网后，**运行一次安装程序**即完成插件安装与离线配置，无需记命令、无需联网。

---

## 一、适用场景与前置条件

### 1.1 适用场景

- 内网机器**无法访问**互联网、npm registry、GitHub 等。
- 需在内网使用 **oh-my-opencode** 插件，且希望**一键完成**安装与配置。

### 1.2 内网机前置条件

- 已安装 **OpenCode**（CLI 或 Desktop）。
- 已安装 **Bun**（用于插件依赖；若使用「仅 plugin 目录 + 预装 node_modules」则可不依赖 Bun 拉包）。
- 若使用「安装程序为 .exe」：无需安装 Python；若使用「.7z 包 + 先解压再安装」：需安装 **7-Zip**。

### 1.3 有网机前置条件（用于准备导入包）

- 能访问 npm/GitHub，可执行项目构建、打包与生成安装程序（如 PyInstaller 打包 exe）。

---

## 二、自包含目录结构（方案 B）

在内网使用的「导入包」建议为**单一自包含目录**，例如 `oh-my-opencode-offline/`，结构如下：

```
oh-my-opencode-offline/
├── plugin/                    # 完整插件目录（必须）
│   ├── dist/
│   │   └── index.js
│   ├── package.json
│   └── node_modules/          # 建议预装，避免内网 bun install
├── cache/                     # 预生成缓存（必须）
│   ├── oh-my-opencode/
│   │   ├── connected-providers.json
│   │   ├── provider-models.json
│   │   └── bin/               # 可选：rg、sg、comment-checker
│   └── opencode/              # 可选：OpenCode 缓存
├── oh-my-opencode-*.tgz       # 可选：若提供则安装程序可优先用 tgz 安装
├── bun-windows/               # 可选：Bun Windows 离线包，供内网未装 Bun 时使用
├── install-offline.exe        # 推荐：一键安装程序（由 install_offline.py 打包）
├── install_offline.py         # 可选：未打包 exe 时可用 Python 运行
├── install-offline.ps1         # 可选：PowerShell 脚本（内网允许时）
└── README.md                  # 简要说明与一键步骤
```

- **必须**：`plugin/`（含 `dist/index.js`、`package.json`，建议含 `node_modules`）、`cache/oh-my-opencode/`（含 `connected-providers.json`、`provider-models.json`）。
- **推荐**：`install-offline.exe`，内网禁止运行脚本时直接运行 exe 即可。
- **可选**：`oh-my-opencode-*.tgz`、`bun-windows/`、`cache/opencode/`、`install_offline.py` / `install-offline.ps1`。

---

## 三、有网环境：准备导入包

在有网环境完成以下步骤，得到可拷贝到内网的**自包含目录**（或 .7z 压缩包）。

### 3.1 构建插件

在项目根目录执行：

```bash
bun run build
```

得到 `dist/`、构建产物与 `package.json`。

### 3.2 准备 plugin 目录

- 将 `dist/`、`bin/`、`postinstall.mjs`、`package.json` 等运行时所需文件拷贝到 `output/plugin/`（或你的导入包根下的 `plugin/`）。
- 在 `plugin/` 目录执行 `bun install`，生成 `node_modules/`，并一并拷贝到导入包，避免内网再拉依赖。

### 3.3 准备 cache 目录

- 在有网环境运行一次 OpenCode（或本插件），使生成：
  - `~/.cache/oh-my-opencode/connected-providers.json`
  - `~/.cache/oh-my-opencode/provider-models.json`
  - 可选：`~/.cache/oh-my-opencode/bin/`（rg、sg、comment-checker）
  - 可选：`~/.cache/opencode/` 下相关缓存
- 将上述目录按相同结构拷贝到导入包的 `cache/oh-my-opencode/`、`cache/opencode/`。

### 3.4 准备一键安装程序

- **推荐**：使用 Python 脚本 `docs/install_offline.py` 打包为单文件 exe（参见 `docs/build-install-exe.md`），将生成的 `install-offline.exe` 放入导入包根目录。
- 或直接将 `install_offline.py`、`install-offline.ps1` 放入导入包根目录（内网允许运行脚本时使用）。

### 3.5 可选：打包为 .7z

将整个自包含目录打成 `oh-my-opencode-offline.7z`，内网先解压再运行安装程序；安装程序支持 `--archive` 参数时也可传入 .7z 路径由程序内部解压。

---

## 四、内网一键安装步骤

### 4.1 拷贝到内网

将「自包含目录」或 `.7z` 通过 U 盘、共享盘等方式拷贝到内网机，例如解压/拷贝到 `D:\offline\oh-my-opencode-offline\`。

### 4.2 运行安装程序（真正一键）

- **方式一（推荐）**：双击或在命令行运行  
  `D:\offline\oh-my-opencode-offline\install-offline.exe`  
  无需安装 Python，无需运行任何脚本。
- **方式二**：若仅有 Python 脚本且内网允许运行脚本：  
  `python D:\offline\oh-my-opencode-offline\install_offline.py`
- **方式三**：若提供的是 .7z 且希望由安装程序解压：  
  `install-offline.exe --archive "D:\offline\oh-my-opencode-offline.7z"`  
  （需已安装 7-Zip）

安装程序将自动完成：

1. **放置缓存**：将 `cache/oh-my-opencode/`、`cache/opencode/` 拷贝到本机用户缓存目录（Windows：`%LOCALAPPDATA%\oh-my-opencode`、`%LOCALAPPDATA%\opencode`）。
2. **解析插件**：优先使用包内 `plugin/dist/index.js`（若存在 tgz 且内网可拉包则可能用 tgz 安装；内网通常会回退到 plugin 目录）。
3. **注册插件**：在 OpenCode 配置目录的 `opencode.json` 中写入 `file:///.../dist/index.js`。
4. **离线配置**：在 `oh-my-opencode.json` 中写入或合并 `experimental.disable_model_list_fetch: true`、`disabled_hooks: ["auto-update-checker"]`、`disabled_mcps: ["websearch","context7","grep_app"]`。

### 4.3 日志与幂等

- 安装程序具备**幂等性**：可重复执行，结果一致。
- 运行后会在包根目录生成 **install-offline.log**，便于排查失败步骤。

---

## 五、安装后：模型与 Provider 配置（可选）

内网无法拉取模型列表，若需指定模型或 Provider，需在配置中手写：

- 在 **opencode.json** 中按 OpenCode 要求配置各 Provider 与模型 ID。
- 在 **oh-my-opencode.json** 的 **agents** 等字段中按需覆盖各 agent 的 **model**，与内网可用 Provider 一致。

可参考有网机已生成的配置，改为内网可用的模型 ID。若缓存中已包含足够信息，部分场景可不改。

---

## 六、验证

1. 启动 OpenCode（如执行 `opencode`），确认无报错、插件已加载。
2. 新建会话，确认不会出现 “Building provider cache for first time” 或 models.dev 相关错误（已通过 `disable_model_list_fetch` 与缓存避免）。
3. 执行一次委托任务（delegate_task），确认能解析模型并创建子任务。
4. 若使用 grep/ast-grep/comment-checker，确认能正常执行（依赖步骤 1 中放置的 **bin** 或系统已安装的 rg/sg）。

若 2 或 3 失败，请检查：缓存是否在正确路径、`connected-providers.json` / `provider-models.json` 是否存在且有内容、`experimental.disable_model_list_fetch` 是否为 **true**。详见 **docs/network-usage-report.md** 第六节。

---

## 七、故障排查

| 现象 | 建议 |
|------|------|
| 安装程序报错「bun add 失败」 | 内网无法访问 npm，安装程序会自动回退到 `plugin/` 目录；确保包内包含 `plugin/dist/index.js` 且建议含 `node_modules`。 |
| 日志中出现 ConnectionRefused / FailedToOpenSocket | 属 bun 尝试访问 registry 的报错；回退到 plugin 后若步骤 3、4 成功则安装已完成，可忽略。 |
| 启动 OpenCode 后提示模型缓存或 provider 相关错误 | 检查 `%LOCALAPPDATA%\oh-my-opencode\`（或 `~/.cache/oh-my-opencode/`）下是否有 `connected-providers.json`、`provider-models.json`；确认 `oh-my-opencode.json` 中 `experimental.disable_model_list_fetch: true`。 |
| 内网禁止运行脚本 | 使用 **install-offline.exe**（由 install_offline.py 打包），直接运行 exe 即可。 |

更多联网行为与离线建议见 **docs/network-usage-report.md**。

---

## 八、与方案 B 的对应关系

| 方案 B 要素 | 本指南实现 |
|-------------|------------|
| 自包含目录 | `oh-my-opencode-offline/` 含 plugin/、cache/、可选 tgz、bun-windows/ |
| 唯一入口脚本 | **install-offline.exe**（或 install_offline.py / install-offline.ps1） |
| 脚本逻辑：解析路径、拷贝 cache | 安装程序自动以「包根」为当前目录，拷贝 cache 到用户缓存目录 |
| 脚本逻辑：注册插件 + 离线配置 | 安装程序写入 opencode.json 的 plugin 条目与 oh-my-opencode.json 的离线配置 |
| 用户操作 | 拷贝整个目录 → 运行 install-offline.exe（或一条 Python/PS1 命令） |

本指南不依赖 OpenCode 宿主支持 `install --offline` 或 `--plugin-path`；通过**独立安装程序 + file:// 插件路径 + 预置缓存与离线配置**，在内网无网络环境下实现**真正一键**安装。
