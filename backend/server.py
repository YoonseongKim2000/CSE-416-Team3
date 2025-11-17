# server.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import FRONTEND_ORIGIN
from routes import user_routes, predict_routes, account_routes
from pymongo import AsyncMongoClient
from dotenv import load_dotenv
import os
from contextlib import asynccontextmanager

#Load .env variables
load_dotenv()
ATLAS_URI = os.getenv('ATLAS_URI')

#Server lifespan(startup/shutdown) behavior
@asynccontextmanager
async def db_lifespan(app: FastAPI):
    #Server Startup
    app.mongodb_client = AsyncMongoClient(ATLAS_URI)
    app.database = app.mongodb_client.get_database("truevision_db")
    ping_response = await app.database.command("ping")
    if int(ping_response["ok"]) != 1:
        raise Exception("Problem connecting to mongoDB cluster")
    else:
        print("Connected to mongoDB cluster")
        print(app.database)
    yield
    #Server Shutdown
    await app.mongodb_client.close()

app = FastAPI(lifespan=db_lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# add routers
app.include_router(user_routes.router)
app.include_router(predict_routes.router)
app.include_router(account_routes.router)