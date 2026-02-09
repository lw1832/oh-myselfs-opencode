# 内网导入包说明

本目录包含将 oh-my-opencode 插件导入**内网（无网络）环境**所需的全部产物，按《内网（无网络）环境安装指南》阶段一在有网环境生成。

## 目录结构

```
output/
├── README.md                    # 本说明
├── oh-my-opencode-3.1.11.tgz    # 插件 npm 包（内网用 Bun 安装：bun add ./oh-my-opencode-3.1.11.tgz）
├── plugin/                      # 完整构建目录（可选：直接拷贝到内网用 file: 指向 dist/index.js）
│   ├── dist/
│   ├── bin/
│   ├── package.json
│   └── postinstall.mjs
└── cache/                       # 缓存目录（拷贝到内网对应用户目录）
    ├── README.md                # 缓存与二进制说明
    ├── oh-my-opencode/          # 对应 ~/.cache/oh-my-opencode 或 %LOCALAPPDATA%\oh-my-opencode
    └── opencode/                # 对应 ~/.cache/opencode 或 %LOCALAPPDATA%\opencode
```

## 内网使用步骤概要

1. **插件**：将 `oh-my-opencode-3.1.11.tgz` 或整个 `plugin/` 目录拷贝到内网。
   - 使用 tgz：在内网新建目录后执行 `bun add ./oh-my-opencode-3.1.11.tgz`，然后在 opencode.json 的 plugin 中填写 `file:///.../node_modules/oh-my-opencode/dist/index.js`。
   - 使用 plugin 目录：将 `plugin/` 拷贝到内网，在内网该目录执行 `bun install` 安装依赖（若内网有私有 npm 源），然后在 opencode.json 中填写 `file:///.../plugin/dist/index.js`。

2. **缓存**：将 `cache/oh-my-opencode/` 与 `cache/opencode/` 下的内容拷贝到内网对应用户的缓存目录（见 `cache/README.md`）。**重要**：`connected-providers.json` 与 `provider-models.json` 需在有网环境运行一次 OpenCode 后生成，本包中若未包含则需从有网机拷贝或按 cache/README 说明操作。

3. **配置**：在内网 `oh-my-opencode.json` 中设置 `experimental.disable_model_list_fetch: true`、`disabled_hooks: ["auto-update-checker"]`、`disabled_mcps: ["websearch", "context7", "grep_app"]`。

详细步骤见项目内 `docs/offline-intranet-installation-guide.md`。
