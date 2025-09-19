from fastapi import FastAPI, status
from pydantic import BaseModel
from typing import List
from pymongo import MongoClient
class Book(BaseModel):
    bookID: int
    title: str
    author: str
    publisher: str
app= FastAPI()
@app.post("/add_new", status_code=status.HTTP_201_CREATED)
def add_book(b1: Book):
    with MongoClient() as client:
        book_collection = client["test"]["BOOK_COLLECTION"]
        result = book_collection.insert_one(b1.dict())
        return {"insertation": result.acknowledged}
@app.get("/books", response_model=List[str])
def get_books():
    with MongoClient() as client:
        book_collection = client["test"]["BOOK_COLLECTION"]
        booklist = book_collection.distinct("title")
        return booklist
@app.get("/books/{id}", response_model=Book)
def get_book(id: int):
    with MongoClient() as client:
        book_collection = client["test"]["BOOK_COLLECTION"]
        b1 = book_collection.find_one({"bookID": id})
        return b1
@app.put("/fix_book/{id}")
async def fix_book(id:int, book1:Book):
    with MongoClient() as client:
        book_collection = client["test"]["BOOK_COLLECTION"]
        b1= book_collection.find_one({"bookID": id-1})
        b1=book1
        return book_collection