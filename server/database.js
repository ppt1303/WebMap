const { MongoClient } = require('mongodb');

class DatabaseConnection {
    constructor() {
        this.client = null;
        this.db = null;
    }

    async connect(databaseName = process.env.DATABASE_NAME || 'myapp') {
        try {
            console.log('🔄 Đang kết nối tới MongoDB Atlas...');
            console.log('Database name:', databaseName);
            
            // Sử dụng connection string từ biến môi trường
            const connectionString = process.env.MONGODB_URI;
            if (!connectionString) {
                throw new Error('MONGODB_URI không được định nghĩa trong file .env');
            }
            
            this.client = new MongoClient(connectionString);
            
            await this.client.connect();
            this.db = this.client.db(databaseName);
            console.log('✅ Kết nối MongoDB Atlas thành công!');
            return this.db;
        } catch (error) {
            console.error('❌ Lỗi kết nối MongoDB Atlas:', error);
            throw error;
        }
    }

    async disconnect() {
        if (this.client) {
            await this.client.close();
            console.log('✅ Đã ngắt kết nối MongoDB Atlas');
        }
    }

    getDb() {
        return this.db;
    }
}

module.exports = {
    DatabaseConnection
};
