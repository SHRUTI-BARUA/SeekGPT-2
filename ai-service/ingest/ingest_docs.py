import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from langchain_community.document_loaders import PyPDFLoader, TextLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.rag import get_vectorstore

DOCS_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "docs")

def load_documents():
    docs = []
    for filename in os.listdir(DOCS_DIR):
        path = os.path.join(DOCS_DIR, filename)
        if filename.endswith(".pdf"):
            docs.extend(PyPDFLoader(path).load())
        elif filename.endswith(".txt") or filename.endswith(".md"):
            docs.extend(TextLoader(path, encoding="utf-8").load())
    return docs

def main():
    print("Loading documents from", DOCS_DIR)
    raw_docs = load_documents()
    print(f"Loaded {len(raw_docs)} raw documents")

    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
    chunks = splitter.split_documents(raw_docs)
    print(f"Split into {len(chunks)} chunks")

    vectorstore = get_vectorstore()
    vectorstore.add_documents(chunks)
    print("Ingestion complete. Vector store persisted to", vectorstore._persist_directory)

if __name__ == "__main__":
    main()
