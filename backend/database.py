from motor.motor_asyncio import AsyncIOMotorClient

# Cấu hình MongoDB
MONGODB_URL = "mongodb+srv://admin:nguyendzjj@cluster0.xobvxwy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = "webmap_db"

# Async client và database
client = AsyncIOMotorClient(MONGODB_URL)
database = client[DATABASE_NAME]

# Collections
book_collection = database["BOOK_COLLECTION"]
test_collection = database["test"]

async def connect_to_mongo():
    """Kết nối tới MongoDB"""
    try:
        await client.admin.command('ping')
        print("Kết nối MongoDB Atlas thành công!")
        
        # Hiển thị thông tin database
        collections = await database.list_collection_names()
        print(f"Collections hiện có: {collections}")
        
    except Exception as e:
        print(f"Lỗi kết nối MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Đóng kết nối MongoDB"""
    client.close()
    print("Đã đóng kết nối MongoDB Atlas")
