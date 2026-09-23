from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from app.config import settings

def describe_image(image_base64: str, user_question: str) -> str:
    """Send an image + question to Gemini's vision-capable model."""
    vision_model = ChatGoogleGenerativeAI(
        model=settings.CHAT_MODEL,
        google_api_key=settings.GOOGLE_API_KEY,
    )
    message = HumanMessage(
        content=[
            {"type": "text", "text": user_question or "Describe this image in detail."},
            {"type": "image_url", "image_url": f"data:image/jpeg;base64,{image_base64}"},
        ]
    )
    response = vision_model.invoke([message])
    return response.content
