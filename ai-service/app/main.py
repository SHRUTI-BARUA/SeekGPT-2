from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from langchain_core.messages import HumanMessage, AIMessage

from app.graph import graph
from app.vision import describe_image

app = FastAPI(title="SeekGPT AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten this to your real frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    history: Optional[list] = []   # list of {"role": "user"|"model", "content": str}
    image_base64: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    # If an image came with this message, handle it as a vision request first
    if req.image_base64:
        reply = describe_image(req.image_base64, req.message)
        return ChatResponse(reply=reply)

    # Rebuild prior conversation as LangChain messages so the model has real memory
    lc_messages = []
    for turn in req.history:
        if turn["role"] == "user":
            lc_messages.append(HumanMessage(content=turn["content"]))
        else:
            lc_messages.append(AIMessage(content=turn["content"]))
    lc_messages.append(HumanMessage(content=req.message))

    result = graph.invoke({"messages": lc_messages, "retrieved_context": ""})
    final_message = result["messages"][-1]
    return ChatResponse(reply=final_message.content)
