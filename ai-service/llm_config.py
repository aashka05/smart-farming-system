from langchain_ollama import ChatOllama 
import os 


def get_llm(model = "gpt-oss:120b-cloud" , temperature = 0)->ChatOllama:
    client_kwargs = {
        "headers":{
            "authorization": f"Bearer {os.getenv('OLLAMA_API_KEY')}"
        }
    }
    llm = ChatOllama(model=model, temperature=temperature, client_kwargs=client_kwargs, base_url="https://ollama.com" , reasoning  = False)
     
    return llm 


#Models list 
#glm-4.7:cloud
#gpt-oss:120b-cloud
#deepseek-v3.1:671b-cloud
#mistral-large-3:675b-cloud