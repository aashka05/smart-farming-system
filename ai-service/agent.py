from langchain.agents import create_agent 
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