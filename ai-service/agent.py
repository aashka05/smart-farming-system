from langgraph.prebuilt import create_react_agent
from tools import all_tools


def create_chatbot_agent(system_prompt, model, checkpointer):
    """
    Create a LangGraph agent with all farming tools bound.
    The agent can call weather APIs, soil data, climate history,
    NPK/pH estimation, and the ML crop recommendation model.
    """
    agent = create_react_agent(
        model,
        all_tools,
        prompt=system_prompt,
        checkpointer=checkpointer,
    )
    return agent