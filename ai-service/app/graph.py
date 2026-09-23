from typing import TypedDict, Annotated, Sequence
import operator
from langchain_core.messages import BaseMessage, SystemMessage, HumanMessage, AIMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode

from app.config import settings
from app.rag import retrieve_context
from app.tools import tools

# ---- 1. Define the shared state every node can read/write ----
class GraphState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    retrieved_context: str

# ---- 2. Set up the LLM, bound to the available tools ----
llm = ChatGoogleGenerativeAI(
    model=settings.CHAT_MODEL,
    google_api_key=settings.GOOGLE_API_KEY,
    temperature=0.3,
)
llm_with_tools = llm.bind_tools(tools)

SYSTEM_PROMPT = """You are SeekGPT, a helpful AI assistant.
You have access to retrieved reference documents (if relevant) and a web_search tool
for anything current or not covered by the reference documents.
Use the web_search tool only when the retrieved context does not answer the question
or the question is clearly about something recent/real-time.
Always be concise and cite whether your answer came from the reference documents,
the web search, or your own general knowledge.
"""

# ---- 3. Node: retrieve relevant chunks from Chroma ----
def retrieve_node(state: GraphState) -> dict:
    last_user_msg = state["messages"][-1].content
    context = retrieve_context(last_user_msg)
    return {"retrieved_context": context}

# ---- 4. Node: the agent — decides to answer directly or call a tool ----
def agent_node(state: GraphState) -> dict:
    context_note = (
        f"\n\nRelevant reference material:\n{state['retrieved_context']}"
        if state["retrieved_context"] else ""
    )
    system = SystemMessage(content=SYSTEM_PROMPT + context_note)
    response = llm_with_tools.invoke([system] + list(state["messages"]))
    return {"messages": [response]}

# ---- 5. Node: executes tool calls the agent requested ----
tool_node = ToolNode(tools)

# ---- 6. Routing logic: does the last AI message contain a tool call? ----
def should_continue(state: GraphState) -> str:
    last_message = state["messages"][-1]
    if getattr(last_message, "tool_calls", None):
        return "tools"
    return END

# ---- 7. Wire the graph together ----
def build_graph():
    workflow = StateGraph(GraphState)

    workflow.add_node("retrieve", retrieve_node)
    workflow.add_node("agent", agent_node)
    workflow.add_node("tools", tool_node)

    workflow.set_entry_point("retrieve")
    workflow.add_edge("retrieve", "agent")
    workflow.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
    workflow.add_edge("tools", "agent")   # after a tool runs, go back to the agent to answer

    return workflow.compile()

graph = build_graph()
