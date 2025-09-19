import uvicorn
from fastapi import FastAPI
from database import connect_to_mongo, close_mongo_connection
from app.api import app as api_app

app = FastAPI(
    title="WebMap API",
    description="API cho ứng dụng WebMap với MongoDB Atlas",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

# Mount API routes
app.mount("/api", api_app)

@app.get("/")
async def root():
    return {
        "message": "WebMap API đang hoạt động", 
        "status": "success",
        "docs": "/docs",
        "api": "/api"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)
