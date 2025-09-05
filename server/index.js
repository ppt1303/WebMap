const express = require('express');
const path = require('path');

// Load dotenv từ file .env ở root directory
require('dotenv').config();

const { DatabaseConnection } = require('./database');
const { generateTestData } = require('./testData');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Khởi tạo kết nối database
const dbConnection = new DatabaseConnection();

async function startServer() {
    try {
        // Kết nối database sử dụng DATABASE_NAME từ .env
        await dbConnection.connect(process.env.DATABASE_NAME);
        console.log('Database MongoDB Atlas đã kết nối thành công!');
        
        // Route trang chủ với thống kê
        app.get('/', async (req, res) => {
            try {
                const db = dbConnection.getDb();
                const collections = ['users', 'locations', 'incidents', 'scenarios', 'resources', 'decisions', 'logs', 'trainingSessions'];
                const stats = {};
                
                for (const collectionName of collections) {
                    const count = await db.collection(collectionName).countDocuments();
                    stats[collectionName] = count;
                }
                
                res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Hệ thống Hỗ trợ Ra quyết định CHTMKT</title>
                        <meta charset="utf-8">
                        <style>
                            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); min-height: 100vh; }
                            .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
                            .header { text-align: center; color: white; margin-bottom: 30px; }
                            .header h1 { font-size: 2.5em; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
                            .header .subtitle { font-size: 1.2em; opacity: 0.9; }
                            .status-card { background: rgba(255,255,255,0.95); padding: 25px; border-radius: 15px; margin-bottom: 30px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
                            .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
                            .stat-card { background: white; padding: 25px; border-radius: 15px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.1); transition: transform 0.3s ease; border-left: 5px solid #1e3c72; }
                            .stat-card:hover { transform: translateY(-5px); }
                            .stat-number { font-size: 2.2em; font-weight: bold; color: #1e3c72; margin-bottom: 5px; }
                            .stat-label { color: #666; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; }
                            .action-buttons { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 30px; }
                            .btn { padding: 15px 20px; background: linear-gradient(45deg, #1e3c72, #2a5298); color: white; text-decoration: none; border-radius: 10px; text-align: center; font-weight: bold; transition: all 0.3s ease; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; }
                            .btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
                            .btn.success { background: linear-gradient(45deg, #27ae60, #2ecc71); }
                            .btn.warning { background: linear-gradient(45deg, #e67e22, #f39c12); }
                            .btn.danger { background: linear-gradient(45deg, #e74c3c, #c0392b); }
                            .btn.info { background: linear-gradient(45deg, #3498db, #2980b9); }
                            .system-badge { position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.1); padding: 10px; border-radius: 50px; color: white; font-size: 0.8em; }
                        </style>
                    </head>
                    <body>
                        <div class="system-badge">CHTMKT System v1.0</div>
                        <div class="container">
                            <div class="header">
                                <h1>Hệ thống Hỗ trợ Ra quyết định</h1>
                                <div class="subtitle">Ứng cứu Sự cố Công nghệ Thông tin - Chỉ huy Tham mưu Kỹ thuật</div>
                            </div>
                            
                            <div class="status-card">
                                <h2>Tình trạng Hệ thống</h2>
                                <p>Server đang hoạt động | Database: ${process.env.DATABASE_NAME} | ${new Date().toLocaleString('vi-VN')}</p>
                                <p><strong>Tổng số bản ghi:</strong> ${Object.values(stats).reduce((sum, count) => sum + count, 0)} | <strong>Collections:</strong> ${Object.keys(stats).length}</p>
                            </div>
                            
                            <div class="stats-grid">
                                ${Object.entries(stats).map(([collection, count]) => {
                                    const labels = {
                                        users: 'Nhân sự', locations: 'Địa điểm', incidents: 'Sự cố',
                                        scenarios: 'Kịch bản', resources: 'Tài nguyên', decisions: 'Quyết định',
                                        logs: 'Nhật ký', trainingSessions: 'Buổi tập'
                                    };
                                    return `
                                        <div class="stat-card">
                                            <div class="stat-number">${count}</div>
                                            <div class="stat-label">${labels[collection]}</div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                            
                            <div class="action-buttons">
                                <a href="/api/insert-test-data" class="btn success">Tạo Dữ liệu Test</a>
                                <a href="/api/collections" class="btn info">Xem Dữ liệu</a>
                                <a href="/api/incidents/active" class="btn">Sự cố Đang xử lý</a>
                                <a href="/api/training/upcoming" class="btn">Lịch Diễn tập</a>
                                <a href="/api/clear-data" class="btn danger" onclick="return confirm('Xác nhận xóa toàn bộ dữ liệu?')">Xóa Dữ liệu</a>
                                <a href="/api/status" class="btn warning">Trạng thái Hệ thống</a>
                            </div>
                        </div>
                    </body>
                    </html>
                `);
            } catch (error) {
                res.status(500).send(`<h1>Lỗi hệ thống: ${error.message}</h1>`);
            }
        });

        // API để thêm dữ liệu test
        app.get('/api/insert-test-data', async (req, res) => {
            try {
                const db = dbConnection.getDb();
                const testData = generateTestData();
                const results = {};
                
                console.log('Bắt đầu tạo dữ liệu test cho hệ thống CHTMKT...');
                
                const insertOrder = ['users', 'locations', 'resources', 'incidents', 'decisions', 'scenarios', 'trainingSessions', 'logs'];
                
                for (const collectionName of insertOrder) {
                    if (testData[collectionName]) {
                        console.log(`Đang thêm ${testData[collectionName].length} bản ghi vào ${collectionName}...`);
                        
                        const collection = db.collection(collectionName);
                        await collection.deleteMany({});
                        const result = await collection.insertMany(testData[collectionName]);
                        
                        results[collectionName] = {
                            inserted: result.insertedCount,
                            total: testData[collectionName].length
                        };
                        
                        console.log(`Đã thêm ${result.insertedCount}/${testData[collectionName].length} bản ghi vào ${collectionName}`);
                    }
                }
                
                console.log('Hoàn thành tạo dữ liệu test!');
                
                res.json({
                    success: true,
                    message: 'Đã tạo dữ liệu test hoàn chỉnh cho hệ thống CHTMKT!',
                    results: results,
                    totalRecords: Object.values(results).reduce((sum, r) => sum + r.inserted, 0),
                    timestamp: new Date()
                });
            } catch (error) {
                console.error('Lỗi khi tạo dữ liệu test:', error);
                res.status(500).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date()
                });
            }
        });

        // API xóa dữ liệu
        app.get('/api/clear-data', async (req, res) => {
            try {
                const db = dbConnection.getDb();
                const collections = ['users', 'locations', 'incidents', 'scenarios', 'resources', 'decisions', 'logs', 'trainingSessions'];
                const results = {};
                
                for (const collectionName of collections) {
                    const collection = db.collection(collectionName);
                    const result = await collection.deleteMany({});
                    results[collectionName] = result.deletedCount;
                }
                
                res.json({
                    success: true,
                    message: 'Đã xóa toàn bộ dữ liệu!',
                    results: results,
                    timestamp: new Date()
                });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // API xem tất cả collections
        app.get('/api/collections', async (req, res) => {
            try {
                const db = dbConnection.getDb();
                const collections = ['users', 'locations', 'incidents', 'scenarios', 'resources', 'decisions', 'logs', 'trainingSessions'];
                const result = {};
                
                for (const collectionName of collections) {
                    const collection = db.collection(collectionName);
                    const count = await collection.countDocuments();
                    const sample = await collection.find().limit(3).toArray();
                    
                    result[collectionName] = { count, sample };
                }
                
                res.json({
                    success: true,
                    collections: result,
                    timestamp: new Date()
                });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // API lấy sự cố đang xử lý
        app.get('/api/incidents/active', async (req, res) => {
            try {
                const db = dbConnection.getDb();
                const activeIncidents = await db.collection('incidents')
                    .find({ status: { $in: ['reported', 'investigating', 'in_progress'] } })
                    .sort({ priority: 1, createdAt: -1 })
                    .toArray();
                
                res.json({
                    success: true,
                    count: activeIncidents.length,
                    incidents: activeIncidents,
                    timestamp: new Date()
                });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // API lấy lịch diễn tập sắp tới
        app.get('/api/training/upcoming', async (req, res) => {
            try {
                const db = dbConnection.getDb();
                const upcomingTraining = await db.collection('trainingSessions')
                    .find({ 
                        status: { $in: ['planned', 'scheduled'] },
                        scheduledDate: { $gte: new Date() }
                    })
                    .sort({ scheduledDate: 1 })
                    .toArray();
                
                res.json({
                    success: true,
                    count: upcomingTraining.length,
                    trainingSessions: upcomingTraining,
                    timestamp: new Date()
                });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // API trạng thái hệ thống
        app.get('/api/status', (req, res) => {
            res.json({
                system: 'Hệ thống Hỗ trợ Ra quyết định CHTMKT',
                status: 'operational',
                version: '1.0.0',
                database: process.env.DATABASE_NAME,
                timestamp: new Date(),
                uptime: Math.floor(process.uptime())
            });
        });

        // Khởi động server
        app.listen(port, () => {
            console.log(`Hệ thống CHTMKT đang chạy tại http://localhost:${port}`);
            console.log(`Tạo dữ liệu test: http://localhost:${port}/api/insert-test-data`);
            console.log(`Database: ${process.env.DATABASE_NAME}`);
        });

    } catch (error) {
        console.error('Lỗi khởi động hệ thống:', error);
        process.exit(1);
    }
}

process.on('SIGINT', async () => {
    console.log('\nĐang tắt hệ thống CHTMKT...');
    await dbConnection.disconnect();
    process.exit(0);
});

startServer();
