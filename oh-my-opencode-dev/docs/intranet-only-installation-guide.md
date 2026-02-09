# 内网操作安装指南（仅内网侧步骤）

本文档只包含在**内网（无网络）机器上**需要执行的操作。假定你已通过 U 盘、共享盘等方式拿到在内网有网环境准备好的**导入包**（含插件 tgz 或 plugin 目录、缓存目录等），且内网已安装 **OpenCode**、**Node.js**、**Bun**。

---

## 一、前置条件

- 内网机已安装：**OpenCode**、**Node.js**、**Bun**。
- 已获得导入包（例如 `output` 目录），其中至少包含：
  - **oh-my-opencode-3.x.x.tgz** 或 **plugin/** 目录（含 `dist/`、`package.json`，以及依赖或 `node_modules`）
  - **cache/oh-my-opencode/**（含 `connected-providers.json`、`provider-models.json`，以及可选 `bin/` 下的 rg、sg、comment-checker）

---

## 二、步骤 1：放置缓存

将导入包中的缓存目录拷贝到本机对应用户目录，使插件和 OpenCode 能读到本地模型/连接缓存与二进制。

| 导入包中的目录 | 本机目标（Linux/macOS） | 本机目标（Windows） |
|----------------|-------------------------|----------------------|
| `cache/oh-my-opencode/` | `~/.cache/oh-my-opencode/` | `%LOCALAPPDATA%\oh-my-opencode\` |
| `cache/opencode/` | `~/.cache/opencode/` | `%LOCALAPPDATA%\opencode\` |

确保 **oh-my-opencode** 目录下存在：
- `connected-providers.json`
- `provider-models.json`  
（若导入包中无，需从已在有网环境跑过一次 OpenCode 的机器拷贝。）

可选：若导入包中带有 **oh-my-opencode/bin/**（rg、sg、comment-checker），一并拷贝到上述 oh-my-opencode 目录下，避免插件首次使用时尝试下载。

---

## 三、步骤 2：安装插件（三选一）

### 方式 A：从 tgz 用 Bun 安装（推荐）

```bash
# 新建专用目录（路径可按公司规范调整）
mkdir -p D:\company\opencode-plugins
cd D:\company\opencode-plugins

bun init -y
bun add .\oh-my-opencode-3.1.11.tgz
```

插件将出现在：`D:\company\opencode-plugins\node_modules\oh-my-opencode\dist\index.js`。  
Linux/macOS 将路径改为如 `/opt/company/opencode-plugins`，tgz 路径相应调整。

### 方式 B：从 plugin 目录用 Bun 安装

若导入包中是完整的 **plugin** 目录（含 `dist/`、`package.json`）：

```bash
# 假设 plugin 已拷贝到 D:\company\oh-my-opencode
cd D:\company\oh-my-opencode
bun install

# 在希望“安装”到的目录
mkdir D:\company\opencode-plugins
cd D:\company\opencode-plugins
bun init -y
bun add "file:D:\company\oh-my-opencode"
```

插件将出现在：`D:\company\opencode-plugins\node_modules\oh-my-opencode\dist\index.js`。

### 方式 C：仅拷贝 plugin 目录，不执行 bun add

将 **plugin** 目录（含 `dist/`、`package.json`、`node_modules/`）拷贝到固定路径（如 `D:\company\oh-my-opencode`）。若缺少 `node_modules`，需在内网该目录执行 `bun install`（依赖来自内网私有 npm 或已随包拷贝）。  
后续在步骤 4 中直接用 `file:` 指向该目录下的 `dist/index.js`。

---

## 四、步骤 3：注册插件（opencode.json）

编辑 OpenCode 配置目录下的 **opencode.json**（或 opencode.jsonc）：

- **Windows**：`%APPDATA%\opencode\opencode.json`
- **Linux/macOS**：`~/.config/opencode/opencode.json`

在 **plugin** 数组中加入插件入口（二选一）：

- **方式 A 或 B**（通过 Bun 安装到 opencode-plugins）：

```json
{
  "plugin": [
    "file:///D:/company/opencode-plugins/node_modules/oh-my-opencode/dist/index.js"
  ]
}
```

- **方式 C**（直接指向 plugin 目录）：

```json
{
  "plugin": [
    "file:///D:/company/oh-my-opencode/dist/index.js"
  ]
}
```

注意：Windows 路径用正斜杠，且为**绝对路径**；路径必须指向 **dist/index.js**，且该包所在目录下存在可用的 **node_modules**。

---

## 五、步骤 4：启用离线并禁用联网（oh-my-opencode.json）

在**同一 OpenCode 配置目录**（或项目 `.opencode/`）下创建或编辑 **oh-my-opencode.json**，内容至少为：

```json
{
  "experimental": {
    "disable_model_list_fetch": true
  },
  "disabled_hooks": [
    "auto-update-checker"
  ],
  "disabled_mcps": [
    "websearch",
    "context7",
    "grep_app"
  ]
}
```

说明：
- **disable_model_list_fetch: true**：不再访问 models.dev，仅用本地缓存。
- **disabled_hooks**：关闭自动更新检查。
- **disabled_mcps**：关闭外网 MCP（websearch、context7、grep_app）。

可选：若不改配置文件，可设置环境变量 **OH_MY_OPENCODE_OFFLINE_MODELS=1**，效果等同 `disable_model_list_fetch: true`。

---

## 六、步骤 5：模型与 Provider 配置

内网无法拉取模型列表，需在 **opencode.json** 中手写各 Provider 与模型 ID，并在 **oh-my-opencode.json** 的 **agents** 中按需覆盖各 agent 的 **model**，与当前内网可用 Provider 一致。可参考有网机已生成的配置再改成内网可用的模型 ID。

---

## 七、步骤 6：验证

1. 启动 OpenCode（如执行 `opencode`），确认无报错、插件已加载。
2. 新建会话，确认不会出现 “Building provider cache for first time” 或 models.dev 相关错误。
3. 执行一次 **delegate_task**（指定 category 或 subagent_type），确认能解析模型并创建子任务。
4. 若使用 grep/ast-grep 等工具，确认能正常执行（依赖步骤 1 中放置的 **bin** 或系统已安装的 rg/sg）。

若 2 或 3 失败，请检查：缓存是否在正确路径、**connected-providers.json** / **provider-models.json** 是否存在且有内容、**experimental.disable_model_list_fetch** 是否为 **true**。

---

## 八、内网操作清单（速查）

| 序号 | 操作 |
|------|------|
| 1 | 将 `cache/oh-my-opencode/`、`cache/opencode/` 拷贝到本机用户缓存目录 |
| 2 | 用 Bun 从 tgz 或 plugin 目录安装插件（或仅拷贝 plugin 并 `bun install`） |
| 3 | 在 opencode.json 的 plugin 中填写 `file:///.../dist/index.js` |
| 4 | 在 oh-my-opencode.json 中设置 disable_model_list_fetch、disabled_hooks、disabled_mcps |
| 5 | 按需在 opencode.json / oh-my-opencode.json 中配置模型与 Provider |
| 6 | 启动 OpenCode 并验证会话与 delegate_task |

完整流程（含在有网环境准备导入包）见 **docs/offline-intranet-installation-guide.md**。

---

## 九、一键安装程序（可选，推荐 exe）

内网通常**禁止运行脚本**（如 .ps1），因此提供基于 Python 的安装程序，并建议在有网环境打包为 **install-offline.exe**，在内网直接运行 exe 即可完成步骤 1～4。

### 使用 exe（推荐）

若导入包中带有 **install-offline.exe**（由 `docs/install_offline.py` 经 PyInstaller 打包，参见 `docs/build-install-exe.md`），将其与 `cache/`、`plugin/` 或 `oh-my-opencode-*.tgz` 放在同一目录后：

- **已解压的包根目录**下直接运行：
  ```text
  install-offline.exe
  ```
- 若拿到的是 **.7z 压缩包**，可先解压再安装，或让 exe 先解压再执行：
  ```text
  install-offline.exe --archive "D:\path\to\oh-my-opencode.7z"
  ```
- 指定包根目录：
  ```text
  install-offline.exe --package-root "D:\path\to\output"
  ```

**依赖：** 内网机需已安装 **Bun**、**7-Zip**（仅在使用 `--archive` 时）；**无需安装 Python 或运行任何脚本**。  
**日志：** 运行后会在包根目录生成 `install-offline.log`，便于排查失败步骤。  
**步骤 5（模型/Provider）** 仍需按需在 opencode.json / oh-my-opencode.json 中手写配置；步骤 6 建议手动执行 `opencode` 验证。

### 如何得到 install-offline.exe

在有网、已安装 Python 的机器上，在**项目根目录**执行：

```bash
pip install pyinstaller
pyinstaller --onefile --name install-offline --console docs/install_offline.py
```

生成的 exe 位于 **dist/install-offline.exe**，拷贝到导入包根目录即可。详细说明见 **docs/build-install-exe.md**。
