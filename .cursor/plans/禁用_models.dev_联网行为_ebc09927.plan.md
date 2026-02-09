---
name: 禁用 models.dev 联网行为
overview: 插件通过调用 OpenCode 的 client.provider.list() 与 client.model.list() 间接触发宿主请求 models.dev；通过新增配置项与两处逻辑修改，可完全禁止插件侧发起这两类调用，仅使用本地缓存，从而在内网或离线时不再联网也不报错。
todos: []
isProject: false
---

# 禁用 oh-my-opencode 中 models.dev 联网行为

## 一、原因说明

**models.dev** 的访问来自 **OpenCode 宿主**，不是 oh-my-opencode 直接请求。插件在以下场景会调用 OpenCode SDK：

- `client.provider.list()`：获取已连接 provider 列表  
- `client.model.list()`：获取可用模型列表

宿主实现这些 API 时会请求 models.dev；无网时可能报错。  
要在插件侧“禁掉 models.dev”，等价于：**插件不再调用上述两个接口**，只使用本地缓存（`~/.cache/oh-my-opencode/` 与 `~/.cache/opencode/models.json`）。

---

## 二、触发点梳理


| 位置                                                                                                    | 行为                                                                  | 说明                                                                                              |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [src/shared/model-availability.ts](oh-my-opencode-dev/src/shared/model-availability.ts)               | `fetchAvailableModels(client, options)`                             | 当缓存不足时会调用 `client.provider.list()`、`client.model.list()` 补全数据                                   |
| [src/shared/connected-providers-cache.ts](oh-my-opencode-dev/src/shared/connected-providers-cache.ts) | `updateConnectedProvidersCache(client)`                             | 主动调用 `client.provider.list()` 和 `client.model.list()` 并写缓存                                      |
| [src/hooks/auto-update-checker/index.ts](oh-my-opencode-dev/src/hooks/auto-update-checker/index.ts)   | `updateAndShowConnectedProvidersCacheStatus(ctx)`                   | 在 `session.created` 时调用 `updateConnectedProvidersCache(ctx.client)`，即每次新会话会刷新缓存并间接触发 models.dev |
| [src/tools/delegate-task/executor.ts](oh-my-opencode-dev/src/tools/delegate-task/executor.ts)         | `resolveCategoryAndModel` 内 `fetchAvailableModels(client, { ... })` | 委托任务解析 category/model 时若缓存不足会走 `client.model.list()`                                            |


因此需要两件事：

1. **不再主动刷新“连接 + 模型”缓存**：在 auto-update-checker 里，根据配置决定是否调用 `updateConnectedProvidersCache`。
2. **取模型列表时不走 client**：在 `fetchAvailableModels` 中增加“仅用缓存”模式（例如 `skipClientFetch`），并在 delegate-task 的 `resolveCategoryAndModel` 中根据同一配置传入该选项。

---

## 三、实现方案（配置 + 两处逻辑）

### 3.1 新增配置项

- **推荐**：在现有 `experimental` 下增加一项，便于与离线/内网方案统一。  
- 文件：[src/config/schema.ts](oh-my-opencode-dev/src/config/schema.ts) 中 `ExperimentalConfigSchema`。  
- 新增字段：`disable_model_list_fetch?: boolean`（默认 `false`）。  
- 含义：为 `true` 时，插件**不再**调用 `client.provider.list()` 与 `client.model.list()`，仅使用本地缓存；未配置或为 `false` 时保持当前行为。

同时建议在 [docs/configurations.md](oh-my-opencode-dev/docs/configurations.md) 或 [docs/network-usage-report.md](oh-my-opencode-dev/docs/network-usage-report.md) 中简短说明：适用于内网/离线、避免访问 models.dev、需事先在有网环境生成好缓存。

### 3.2 修改一：`fetchAvailableModels` 支持“仅用缓存”

- 文件：[src/shared/model-availability.ts](oh-my-opencode-dev/src/shared/model-availability.ts)。  
- 在 `fetchAvailableModels(client?, options?)` 的 `options` 中增加：`skipClientFetch?: boolean`。  
- 行为：当 `skipClientFetch === true` 时：  
  - 不调用 `client?.provider?.list()`（即不再用 client 补全 `connectedProviders`）；  
  - 不调用 `client?.model?.list()`；  
  - 仅依据 `readConnectedProvidersCache()`、`readProviderModelsCache()`、以及 `~/.cache/opencode/models.json` 组装并返回 `Set<string>`；若缓存都不存在或为空，则返回空 `Set`。
- 现有“未传 client 时仅用缓存”的逻辑可保留，仅在有 client 且未设 `skipClientFetch` 时才调 client。

这样，所有调用 `fetchAvailableModels` 的地方在传入 `skipClientFetch: true` 后都不会再触发 models.dev。

### 3.3 修改二：delegate-task 与 auto-update-checker 使用该配置

**delegate-task（唯一传入了 client 的调用点）：**

- 在 [src/tools/delegate-task/types.ts](oh-my-opencode-dev/src/tools/delegate-task/types.ts) 的 `DelegateTaskToolOptions` 中增加：`skipModelListFetch?: boolean`。  
- 在 [src/index.ts](oh-my-opencode-dev/src/index.ts) 中创建 delegate task 时传入：  
`skipModelListFetch: pluginConfig.experimental?.disable_model_list_fetch === true`。  
- 在 [src/tools/delegate-task/executor.ts](oh-my-opencode-dev/src/tools/delegate-task/executor.ts) 中，`ExecutorContext` 增加 `skipModelListFetch?: boolean`；在 `resolveCategoryAndModel` 中调用 `fetchAvailableModels(client, { connectedProviders: ..., skipClientFetch: executorCtx.skipModelListFetch })`。  
- 从 `createDelegateTask` 的 options 把 `skipModelListFetch` 传入 executor 的 context（在 tools.ts 里组 executorCtx 时带上该字段即可）。

**auto-update-checker（刷新缓存 + 可能弹 toast）：**

- 在 [src/hooks/auto-update-checker/types.ts](oh-my-opencode-dev/src/hooks/auto-update-checker/types.ts) 的 `AutoUpdateCheckerOptions` 中增加：`disableModelListFetch?: boolean`。  
- 在 [src/index.ts](oh-my-opencode-dev/src/index.ts) 创建 auto-update-checker 时传入：  
`disableModelListFetch: pluginConfig.experimental?.disable_model_list_fetch === true`。  
- 在 [src/hooks/auto-update-checker/index.ts](oh-my-opencode-dev/src/hooks/auto-update-checker/index.ts) 的 `updateAndShowConnectedProvidersCacheStatus` 中：  
  - 若 `disableModelListFetch === true`，则**不调用** `updateConnectedProvidersCache(ctx.client)`，也不再提示 “Building provider cache for first time”；可选：若希望完全静默，也可在 `disableModelListFetch` 为 true 时跳过 `showModelCacheWarningIfNeeded` 的 toast（避免提示用户去执行 `opencode models --refresh`，因为离线环境无法刷新）。

按上述修改后，配置 `experimental.disable_model_list_fetch: true` 即可：不刷新缓存、不调 client 取模型列表，从而不再触发 models.dev，无网时也不会因此报错。

---

## 四、可选：环境变量兜底

若希望不依赖配置文件（例如统一由部署脚本设置），可增加环境变量兜底：

- 在 `fetchAvailableModels` 中：若存在环境变量（如 `OH_MY_OPENCODE_OFFLINE_MODELS=1`），则等价于 `skipClientFetch: true`（或与 options 做 OR）。  
- 在 `updateConnectedProvidersCache` 中：若同一环境变量存在，则直接 return，不执行任何 client 调用。  
- 在 auto-update-checker 中：若该环境变量存在，则视为 `disableModelListFetch: true`，不调用 `updateConnectedProvidersCache`。

这样即使未改 `oh-my-opencode.json`，内网机器也可通过环境变量彻底禁用 models.dev 相关请求。

---

## 五、测试与文档建议

- **单测**：  
  - `model-availability.test.ts`：对 `fetchAvailableModels(undefined, { skipClientFetch: true })` 及带 client 但 `skipClientFetch: true` 的情况断言不调用 client，仅用缓存或返回空集。  
  - `connected-providers-cache`：可增加“当传入 skipFetch 或环境变量时不再调用 client”的覆盖（若采用环境变量方案）。
- **文档**：在 [docs/network-usage-report.md](oh-my-opencode-dev/docs/network-usage-report.md) 的“离线或受限网络环境建议”中增加一条：设置 `experimental.disable_model_list_fetch: true`（及可选环境变量）可禁用对 models.dev 的间接触发，仅使用本地模型/连接缓存。

---

## 六、小结


| 目标               | 做法                                                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 不再联网查 models.dev | 插件不再调用 `client.provider.list()` 与 `client.model.list()`                                                                                           |
| 配置开关             | `experimental.disable_model_list_fetch: true`                                                                                                     |
| 逻辑修改             | ① `fetchAvailableModels` 支持 `skipClientFetch`，仅用缓存；② auto-update-checker 不调用 `updateConnectedProvidersCache`；③ delegate-task 传入 `skipClientFetch` |
| 可选               | 环境变量 `OH_MY_OPENCODE_OFFLINE_MODELS=1` 作为兜底                                                                                                       |


按此实现后，配置完成后将不会再有“联网搜索 models.dev”的行为，无网时也不会因此报错；离线使用前需在有网环境至少运行一次以生成 `connected-providers.json` / `provider-models.json`（或从它机拷贝缓存到 `~/.cache/oh-my-opencode/` 与 `~/.cache/opencode/`）。