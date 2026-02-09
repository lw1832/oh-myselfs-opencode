# LLM 如何使用 MCP 与 Agent Skills —— 原理与 LangGraph 集成说明

本文用简洁的自然语言说明：当你手握「通用 OpenAI API Key」并用 LangGraph 构建 Agent 工作流时，LLM 是如何「感知」并「使用」MCP 与 Agent Skills 的，以及如何用伪代码落地。

---

## 一、核心结论（一句话）

**LLM 本身不直接「连」MCP 或读你的 Skill 文件；它只通过「工具列表 + 每个工具的名字、描述、参数 schema」来感知能力。**  
你要做的是：把 MCP 里的工具、以及你想提供的「技能」都转成这套「工具定义」，在调用 LLM 时通过 `tools` 参数传进去；LLM 在需要时输出「调用哪个工具、传什么参数」，由你的程序去真正执行（例如请求 MCP 服务或执行本地函数），再把结果塞回对话，LLM 就能继续推理或回复用户。

---

## 二、LLM 如何「感知」工具？（原理）

- 大模型在推理时只能看到：**当前对话历史 + 你提供的「工具定义」**。
- 「工具定义」一般是 **JSON Schema** 形式，包含：
  - **name**：工具名（如 `get_weather`）
  - **description**：用自然语言描述「这个工具做什么、何时用」（LLM 靠它决定要不要调用）
  - **parameters**：参数的 JSON Schema（类型、必填/可选等）

流程可以概括为：

1. **你**：把「所有能力」整理成一份「工具列表」（含 name、description、parameters），在每次请求里通过 API 的 `tools` 参数传给 LLM。  
2. **LLM**：根据用户问题和 description，决定是否要调用某个工具；若要，就按 schema 输出「工具名 + 参数」的结构化内容（如 OpenAI 的 `tool_calls`）。  
3. **你的程序**：解析 `tool_calls`，真正去执行（调 MCP 服务器、或跑本地函数），得到结果。  
4. **你**：把「工具名 + 参数 + 执行结果」以「工具消息」的形式追加到对话里，再继续请求 LLM。  
5. LLM 看到工具结果后，可以继续思考、再调工具，或直接给用户最终回复。

所以：**MCP 和 Agent Skills 要让 LLM 用上，最终都要变成「工具定义」出现在 `tools` 里；LLM 只认这套接口，不认协议或文件本身。**

---

## 三、MCP（Model Context Protocol）在这里扮演什么角色？

- **MCP** 是一套**标准协议**，用来让「各种数据源、工具、应用」以统一方式暴露给 AI 应用（如你的 Agent）。
- 典型组件：
  - **MCP Server**：真正提供「工具」的服务（例如天气、数据库、文件系统）。每个工具仍有 name、description、参数。
  - **MCP Client**：在你的进程里运行，负责连接一个或多个 MCP Server，**拉取工具列表并转成你的框架能用的格式**（例如 OpenAI 兼容的 `tools` 列表）。
  - **传输**：可以是 stdio（本地子进程）、HTTP/SSE 等。

因此：

- **LLM 不直接连 MCP**，而是：**你的程序用 MCP Client 向 MCP Server 要「工具列表」→ 转成 `tools` 定义 → 和 LLM 对话时把这些 `tools` 传给 LLM。**
- 当 LLM 返回「要调用某个工具」时，你的程序再通过 MCP Client 去请求对应的 MCP Server 执行，拿到结果后塞回对话。

一句话：**MCP 负责「标准化地提供工具」；你的 Agent 负责「把这类工具变成 LLM 能见的 tools，并在运行时执行、回写结果」。**

---

## 四、Agent Skills 是什么？如何被 LLM 使用？

在「通用 OpenAI API + LangGraph」的语境下，**Agent Skills** 可以理解为：**你希望 Agent 具备的能力集合**。实现方式通常有两种（可同时用）：

1. **工具型 Skill**  
   每个「技能」对应一个或多个工具（例如：查天气、查数据库、发邮件）。  
   - 你把这些工具用 **name + description + parameters** 定义好，放进 `tools` 列表。  
   - description 写清楚「什么时候该用这个技能」，LLM 就会在合适的时候选择调用。  
   - 这些工具可以来自：MCP Server、本地函数、或其它 API 封装。

2. **说明型 Skill（系统提示）**  
   在系统提示（system prompt）里用自然语言描述 Agent 的职责、规范、领域知识。  
   - 例如：「你是一名客服，优先使用「查订单」工具再回答」。  
   - LLM 会结合 system prompt 和 `tools` 的 description 一起做决策。

所以：**Agent Skills 要么变成「工具定义」进 `tools`，要么变成「系统提示」进 system message；LLM 通过「读这些文本 + 工具 schema」来「感知」并运用技能。**

---

## 五、用 LangGraph + OpenAI API 时，如何接入 MCP 与 Skills？

思路是统一的：

1. **准备工具列表**
   - **MCP 工具**：用 MCP Client（如 `langchain-mcp-adapters` 的 `MultiServerMCPClient`）连接你的 MCP Server(s)，调用类似 `get_tools()` 的接口，得到「已按 name/description/parameters 标准化」的工具列表。
   - **自定义 / Skill 工具**：自己用框架提供的 `@tool` 或等价方式定义函数，并写好 name、description、参数 schema。
2. **合并**：把「MCP 拉取的工具」和「自定义 Skill 工具」合并成一个大列表 `all_tools`。
3. **绑到 LLM**：在 LangGraph 里构建 Agent 时，把 `all_tools` 绑定到 LLM 节点（例如 ReAct 的「先推理再选工具」节点）。底层会把这些工具转成 OpenAI 的 `tools` 格式并在每轮请求里发给模型。
4. **执行与回写**：当 LLM 返回 `tool_calls` 时，LangGraph 的「执行工具」节点会根据 name 找到对应工具并执行（本地函数或通过 MCP Client 调 MCP Server），然后把结果以 ToolMessage 形式写回状态，继续下一轮。

这样，**LLM 就能「感知」并「使用」所有来自 MCP 和 Agent Skills 的能力**，而不需要知道背后是 MCP 还是本地函数。

---

## 六、开发者需要实现的工程化部分（清单）

在开发「能使用 Agent Skills 和 MCP 服务」的 Agent 工作流时，下面是你**作为开发者必须自己写/配置**的工程化内容；框架（如 LangGraph、langchain-mcp-adapters）只提供拼装和协议，具体「连谁、提供什么技能、怎么执行」都由你实现。

### 6.1 你必须实现的代码与配置（必做）

| 序号 | 工程化项 | 你要做的事 | 对应代码/配置 |
|------|----------|------------|----------------|
| **1** | **MCP 客户端配置与工具拉取** | 决定连哪些 MCP Server（本地 stdio 或远程 HTTP）、每个 Server 的地址或启动命令；在应用启动或首次需要时创建 MCP Client，并调用 `get_tools()` 拉取工具列表。 | `MultiServerMCPClient({ "server_name": { "transport": "stdio" 或 "http", "command"/"args" 或 "url" } })`，以及 `await client.get_tools()`。若用有状态会话，则 `async with client.session("server_name") as session` + `load_mcp_tools(session)`。 |
| **2** | **自定义 Agent Skills 的工具定义** | 为每个「非 MCP 提供」的技能写一个可调用对象：函数 + **name、description、参数 schema**（类型、必填/可选、描述）。description 要写清「何时用」，供 LLM 选择。 | 使用框架的 `@tool` 或等价方式（如 `StructuredTool.from_function`），为每个技能写一个函数，文档字符串或显式 `args_schema` 作为 description/parameters。 |
| **3** | **工具列表的合并与绑定** | 把「MCP 拉取到的工具列表」和「自定义 Skill 工具列表」合并成一份 `all_tools`；把这份列表绑定到 LLM（或传给 LangGraph 的 Agent 构造器）。 | `all_tools = mcp_tools + custom_tools`；`create_react_agent(llm, tools=all_tools)` 或 `llm.bind_tools(all_tools)`。 |
| **4** | **工具执行与结果回写** | 若使用 `create_react_agent`，框架已内置「解析 tool_calls → 按 name 找工具 → 执行 → 写回 ToolMessage」；若自己写 ReAct 循环，则你需要实现：根据 `tool_calls` 的 name/args 调用对应工具（本地函数或通过 MCP Client 调 MCP Server），并把返回值封装成 ToolMessage 追加到 messages，再继续请求 LLM。 | 使用 prebuilt 时无需写；自建图时：在「工具执行」节点里维护 `name → callable` 的映射，执行后往状态里追加 `ToolMessage(tool_call_id=..., content=result)`。 |
| **5** | **系统提示（说明型 Skills）** | 用自然语言写好 Agent 的角色、规范、优先使用哪些工具等，在每次会话或首次请求时作为 system message 注入到 `messages`。 | `inputs["messages"]` 开头插入 `{"role": "system", "content": "你是…，优先使用…工具…"}`；或通过 `create_react_agent(..., prompt=...)` 等参数注入。 |
| **6** | **运行配置与安全** | 配置 OpenAI API Key、MCP Server 的 URL/命令行/环境变量；避免把 Key 写死在代码里（用环境变量或配置服务）。若 MCP 走 HTTP，可能还需配置认证头、超时等。 | `ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"))`；`MultiServerMCPClient` 的 `url`/`command`/`args` 从配置或环境变量读取；HTTP 时在 connection 里配 `headers`/`auth`。 |

### 6.2 你可选实现的工程化部分（增强）

| 序号 | 工程化项 | 你要做的事 | 对应代码/配置 |
|------|----------|------------|----------------|
| **7** | **MCP 工具拦截器（Tool Interceptors）** | 在 MCP 工具执行前后做统一逻辑：注入用户/会话上下文、改请求参数、限流、鉴权、日志、重试或降级。 | 实现 `async def interceptor(request: MCPToolCallRequest, handler): ... return await handler(request)`，传给 `MultiServerMCPClient(..., tool_interceptors=[...])`。 |
| **8** | **错误与超时处理** | 对工具执行（含 MCP 调用）做 try/except、超时、重试；失败时返回给 LLM 的 ToolMessage 用固定话术（如「工具暂时不可用，请稍后再试」），避免把堆栈暴露给模型。 | 在工具执行节点或拦截器里 `try/except`，捕获 `TimeoutError`/`ConnectionError` 等，返回受控的 ToolMessage。 |
| **9** | **有状态 MCP 会话** | 若某个 MCP Server 需要跨多次调用的会话状态，不用默认的「每次调用新建 session」，改为显式 `async with client.session("server_name") as session`，用 `load_mcp_tools(session)` 拿到工具，并在同一会话生命周期内复用。 | `MultiServerMCPClient` + `client.session("server_name")` + `load_mcp_tools(session)`，在 Agent 或图的状态里持有该 session（注意生命周期与并发）。 |
| **10** | **工具名冲突与前缀** | 多个 MCP Server 可能暴露同名工具，导致 name 冲突。可为 MCP 工具名加前缀（如 `server_name__tool_name`）。 | `MultiServerMCPClient(..., tool_name_prefix=True)` 或等价配置，使工具名带 server 前缀。 |
| **11** | **自建 MCP Server（若你要对外暴露自己的能力）** | 把你的能力（如内部 API、数据库、脚本）以 MCP 协议暴露，供自己的 Agent 或其他客户端调用。需要实现 MCP Server：注册工具、处理 `tools/call`、按协议返回结果。 | 使用如 FastMCP：`@mcp.tool()` 注册函数，`mcp.run(transport="stdio"|"http")`；或使用官方 MCP SDK 实现 Server。 |

### 6.3 小结：你写的代码主要落在哪里

- **必做**：MCP 连接配置 + `get_tools()`；自定义 Skill 的 `@tool` 定义；`all_tools` 合并与绑定；system prompt 编写与注入；API Key 与 MCP 地址等配置。
- **框架代劳**：把 tools 转成 OpenAI 的 `tools` 格式、在每轮请求里带上；若用 `create_react_agent`，还有「解析 tool_calls → 执行 → 回写 ToolMessage」的循环。
- **选做**：拦截器、错误/重试、有状态 MCP 会话、工具名前缀、自建 MCP Server。

---

## 七、伪代码示例（概念级）

下面用**伪代码**把「OpenAI API + LangGraph + MCP + 自定义 Skill」串起来，便于你在自己的项目里对照实现。

### 7.1 只用手写工具（理解「工具 → LLM 感知」）

```python
# 伪代码：仅用 OpenAI + 手写工具，理解「LLM 如何感知工具」

from langchain_openai import ChatOpenAI
from langchain_core.tools import tool

# 1. 定义一个「技能」：查天气（name + description + 参数 = LLM 的感知来源）
@tool
def get_weather(location: str) -> str:
    """在用户询问某地天气时调用此工具。参数为地点名称。"""
    # 真实实现可以是调 API、查库等
    return f"{location} 当前晴，25°C"

# 2. 工具列表 = Agent 的「技能列表」（对 LLM 可见）
tools = [get_weather]

# 3. 绑定到模型：每次请求都会把 tools 的 schema 发给 OpenAI
llm = ChatOpenAI(model="gpt-4o", api_key="YOUR_OPENAI_API_KEY")
llm_with_tools = llm.bind_tools(tools)

# 4. 对话循环（简化）：用户消息 → LLM → 若有 tool_calls → 执行 → 结果塞回 → 再调 LLM
messages = [HumanMessage(content="北京天气怎么样？")]
response = llm_with_tools.invoke(messages)

if response.tool_calls:
    for tc in response.tool_calls:
        result = 执行工具(tc.name, tc.args)  # 例如 get_weather(location="北京")
        追加 ToolMessage(tool_call_id=tc.id, content=result)
    messages = messages + [response] + tool_messages
    response = llm_with_tools.invoke(messages)  # LLM 根据工具结果继续回答
```

这里可以看到：**LLM 只看到 `tools` 里的 name/description/parameters；执行与结果回写是你的代码做的。**

### 7.2 接入 MCP：把 MCP 工具变成「LLM 可见的 tools」

```python
# 伪代码：MCP 工具 + 手写工具 一起给 LLM

from langchain_mcp_adapters.client import MultiServerMCPClient

# 1. 连接 MCP Server，拿到「标准化」的工具列表
mcp_client = MultiServerMCPClient({
    "math": {
        "transport": "stdio",
        "command": "python",
        "args": ["/path/to/math_server.py"],
    },
    "weather": {
        "transport": "http",
        "url": "http://localhost:8000/mcp",
    },
})
mcp_tools = await mcp_client.get_tools()  # 已是 name/description/parameters 形式

# 2. 自定义 Skill 工具（同上）
@tool
def search_internal_doc(query: str) -> str:
    """当用户问公司内部文档或流程时使用。"""
    return 内部检索(query)

# 3. 合并 = Agent 的全部「技能」
all_tools = mcp_tools + [search_internal_doc]

# 4. 在 LangGraph 里用 all_tools 建 ReAct Agent（见下）
```

### 7.3 LangGraph 里绑定 MCP + Skills 的 Agent 工作流

```python
# 伪代码：LangGraph ReAct Agent，使用 OpenAI + MCP + 自定义 Skills

from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI
from langchain_mcp_adapters.client import MultiServerMCPClient

# 1. MCP 工具
mcp_client = MultiServerMCPClient({ "math": {...}, "weather": {...} })
mcp_tools = await mcp_client.get_tools()

# 2. 自定义 Skill 工具
@tool
def get_weather(location: str) -> str: ...

all_tools = mcp_tools + [get_weather]

# 3. 模型（用你的 OpenAI API Key）
llm = ChatOpenAI(model="gpt-4o", api_key="YOUR_OPENAI_API_KEY")

# 4. 创建 ReAct Agent：内部会 bind_tools(all_tools)，并处理「推理 → 选工具 → 执行 → 再推理」循环
agent = create_react_agent(llm, tools=all_tools)

# 5. 可选：用 system prompt 表达「说明型」Skill
config = {"configurable": {}}
inputs = {
    "messages": [
        {"role": "system", "content": "你是助手。优先用查天气、数学工具回答相关问题。"},
        {"role": "user", "content": "上海今天天气如何？再算一下 (3+5)*2。"},
    ]
}
result = await agent.ainvoke(inputs, config)
# result["messages"] 里会有：用户消息、LLM 的 tool_calls、工具结果、最终回复
```

要点：

- **MCP**：通过 `MultiServerMCPClient.get_tools()` 变成和手写工具同构的 `tools`，一并传给 `create_react_agent`。
- **Agent Skills**：工具型 = `all_tools` 里每个工具的 name/description；说明型 = system message。
- **LLM 感知**：完全通过「发给 OpenAI 的 `tools` + 对话里的 system/user/assistant/tool messages」实现，无需 LLM 直接连 MCP 或读 Skill 文件。

---

## 八、小结表

| 概念 | 作用 | LLM 如何「感知」并「使用」 |
|------|------|-----------------------------|
| **工具（Function/Tool）** | 可执行的能力（查天气、算数、查库等） | 通过 `tools` 参数中的 name + description + parameters；LLM 输出 tool_calls，由你的程序执行并回写结果。 |
| **MCP** | 标准化地暴露「工具/资源/提示」的协议 | 你用 MCP Client 拉取工具列表，转成 `tools` 再传给 LLM；执行时由 MCP Client 请求 MCP Server。 |
| **Agent Skills** | Agent 应具备的能力与规范 | 工具型 → 写成工具的 name/description 进 `tools`；说明型 → 写进 system prompt。 |

**记住**：拿通用 OpenAI API Key 用 LangGraph 做 Agent 时，**让 LLM 感知并使用 MCP 与 Agent Skills 的方式，就是把它们都变成「工具定义」和（可选）系统提示，在请求里传给 LLM，并由你在图中执行工具、回写结果。** 上面伪代码可直接对应到 LangChain/LangGraph 和 `langchain-mcp-adapters` 的真实 API 使用。
