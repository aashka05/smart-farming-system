from pymongo import MongoClient 
from dotenv import load_dotenv 
from langgraph.checkpoint.mongodb import MongoDBSaver 
import os

load_dotenv() 
def get_client()->MongoClient:
    return MongoClient(os.getenv("MONGO_URI"))

def get_checkpointer()->MongoDBSaver:
    return MongoDBSaver(get_client())