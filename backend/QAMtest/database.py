from motor.motor_asyncio import AsyncIOMotorClient

MONGO_DETAILS = "mongodb://localhost:27017"  # đổi nếu cần

client = AsyncIOMotorClient(MONGO_DETAILS)
database = client["mapdb"]       # tên database
markers_collection = database["markers"]  # tên collection