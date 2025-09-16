from fastapi import FastAPI
from pydantic import BaseModel
app = FastAPI()
data= []
class book(BaseModel):
    id:int
    tilte: str 
    author: str 
    publisher: str
@app.post("/book/")
async def add_book(new_book: book):
    data.append(new_book)
    return data
@app.get("/getbook/{id}")
async def put_book(id:int):
    id= id-1
    return data[id]
@app.put("/book/{id}")
async def fix_book(id:int, book1:book):
    data[id-1]= book1
    return data
@app.delete("/book/{id}")
async def delete_book(id:int):
    data.pop(id-1)
    return data