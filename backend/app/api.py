from fastapi import FastAPI, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from bson import ObjectId
from database import book_collection, test_collection, client

app = FastAPI()

# Pydantic models
class Book(BaseModel):
    title: str
    author: Optional[str] = None
    description: Optional[str] = None

class BookResponse(Book):
    id: str

# Helper function
def book_helper(book) -> dict:
    return {
        "id": str(book["_id"]),
        "title": book["title"],
        "author": book.get("author"),
        "description": book.get("description")
    }

@app.get("/")
async def api_root():
    return {"message": "WebMap API endpoints", "version": "1.0.0"}

@app.get("/test-db")
async def test_database():
    """Test kết nối MongoDB"""
    try:
        await client.admin.command('ping')
        
        test_doc = {"test": "connection", "timestamp": "2025-01-20"}
        result = await test_collection.insert_one(test_doc)
        
        return {
            "status": "success",
            "message": "Kết nối MongoDB thành công",
            "inserted_id": str(result.inserted_id)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi kết nối: {str(e)}")

@app.get("/books", response_model=List[BookResponse])
async def get_books():
    """Lấy danh sách tất cả sách"""
    try:
        books = []
        async for book in book_collection.find():
            books.append(book_helper(book))
        return books
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/books/{book_id}", response_model=BookResponse)
async def get_book(book_id: str):
    """Lấy thông tin sách theo ID"""
    try:
        book = await book_collection.find_one({"_id": ObjectId(book_id)})
        if not book:
            raise HTTPException(status_code=404, detail="Không tìm thấy sách")
        return book_helper(book)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/books", response_model=BookResponse)
async def create_book(book: Book):
    """Tạo sách mới"""
    try:
        result = await book_collection.insert_one(book.dict())
        new_book = await book_collection.find_one({"_id": result.inserted_id})
        return book_helper(new_book)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/books/{book_id}", response_model=BookResponse)
async def update_book(book_id: str, book: Book):
    """Cập nhật thông tin sách"""
    try:
        result = await book_collection.update_one(
            {"_id": ObjectId(book_id)}, 
            {"$set": book.dict(exclude_unset=True)}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy sách")
        
        updated_book = await book_collection.find_one({"_id": ObjectId(book_id)})
        return book_helper(updated_book)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/books/{book_id}")
async def delete_book(book_id: str):
    """Xóa sách"""
    try:
        result = await book_collection.delete_one({"_id": ObjectId(book_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy sách")
        return {"message": "Đã xóa sách thành công"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
