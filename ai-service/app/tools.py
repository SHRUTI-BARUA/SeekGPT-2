from langchain_community.tools.tavily_search import TavilySearchResults
from app.config import settings
import os

os.environ["TAVILY_API_KEY"] = settings.TAVILY_API_KEY

web_search_tool = TavilySearchResults(max_results=3)

tools = [web_search_tool]
