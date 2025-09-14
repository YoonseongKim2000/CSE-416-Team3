from pymongo import MongoClient
from dotenv import load_dotenv
import os

#Load .env variables
load_dotenv()
ATLAS_URI = os.getenv('ATLAS_URI')

client = MongoClient(ATLAS_URI)
db = client.unnamed_db

