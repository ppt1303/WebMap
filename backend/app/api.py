from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

uri="mongodb://localhost:27017/"
db_name="webmap"

client = MongoClient(uri)
db = client[db_name]


@app.get("/")
async def read_root():
    return {"Hello": "World"}