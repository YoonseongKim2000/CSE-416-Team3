from pymongo import MongoClient
from dotenv import load_dotenv
import os

#Load .env variables
load_dotenv()
ATLAS_URI = os.getenv('ATLAS_URI')

class AtlasClient ():

    # connect to database
    def __init__ (self):
        self.mongodb_client = MongoClient(ATLAS_URI)
        self.database = self.mongodb_client[unnamed_db]

    def ping (self):
        self.mongodb_client.admin.command('ping')

    def get_users (self):
        collection = self.mongodb_client[users]
        users = collection.find({})
        return users