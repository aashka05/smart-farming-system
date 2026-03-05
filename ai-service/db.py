"""
db.py — Checkpoint storage for LangGraph agent.

Tries MongoDB first (via MONGO_URI env-var).
Falls back to an in-memory saver so the service can start without Mongo.
"""

import os
from dotenv import load_dotenv
from langgraph.checkpoint.memory import MemorySaver

load_dotenv()


def get_checkpointer():
    """Return a MongoDBSaver if possible, else MemorySaver."""
    mongo_uri = os.getenv("MONGO_URI")
    if mongo_uri:
        try:
            from pymongo import MongoClient
            from langgraph.checkpoint.mongodb import MongoDBSaver
            client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
            # Quick connectivity test
            client.admin.command("ping")
            print("✅ MongoDB checkpointer connected")
            return MongoDBSaver(client)
        except Exception as e:
            print(f"⚠️  MongoDB unavailable ({e}), using in-memory checkpointer")
    else:
        print("ℹ️  No MONGO_URI set, using in-memory checkpointer")
    return MemorySaver()