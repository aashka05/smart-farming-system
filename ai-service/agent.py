from langchain.agents import create_agent
from llm_config import get_llm
from db import get_checkpointer
from langchain.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage
from prompts import system_prompt
from tools import all_tools


def create_chatbot_agent(system_prompt, model, checkpointer):
    """
    Create a LangGraph agent with all farming tools bound.
    The agent can call weather APIs, soil data, climate history,
    NPK/pH estimation, and the ML crop recommendation model.
    """
    agent = create_agent(
        model=model,
        tools=all_tools,
        system_prompt=system_prompt,
        checkpointer=checkpointer,
    )
    return agent