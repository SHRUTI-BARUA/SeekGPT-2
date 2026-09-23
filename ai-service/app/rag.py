from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from app.config import settings

def get_embeddings():
    return GoogleGenerativeAIEmbeddings(
        model=settings.EMBEDDING_MODEL,
        google_api_key=settings.GOOGLE_API_KEY,
    )

def get_vectorstore():
    return Chroma(
        collection_name="seekgpt_docs",
        embedding_function=get_embeddings(),
        persist_directory=settings.CHROMA_PERSIST_DIR,
    )

def retrieve_context(query: str, k: int = 4) -> str:
    """Fetch the k most relevant chunks for a query and join them into one string."""
    vectorstore = get_vectorstore()
    docs = vectorstore.similarity_search(query, k=k)
    if not docs:
        return ""
    return "\n\n---\n\n".join(d.page_content for d in docs)
