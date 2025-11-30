// Test script để kiểm tra frontend trong browser
// Mở http://localhost:3000/jobs trong browser và kiểm tra console

console.log('🔍 Hướng dẫn kiểm tra frontend:');
console.log('');
console.log('1. Mở browser và truy cập: http://localhost:3000/jobs');
console.log('2. Mở Developer Tools (F12)');
console.log('3. Chuyển đến tab Console');
console.log('4. Tìm các log messages sau:');
console.log('');
console.log('   🚀 Jobs page mounted, fetching jobs...');
console.log('   🌐 API URL from env: http://localhost:3001');
console.log('   🔍 Starting to fetch jobs from API...');
console.log('   🌐 Making API call to /jobs...');
console.log('   📡 API Response received');
console.log('   ✅ Jobs API call successful');
console.log('');
console.log('Nếu bạn thấy các log này, frontend đang hoạt động đúng.');
console.log('Nếu không thấy, có thể có lỗi JavaScript.');
console.log('');
console.log('Cũng kiểm tra tab Network:');
console.log('- Tìm request đến localhost:3001/jobs');
console.log('- Status code nên là 200');
console.log('- Response nên chứa jobs data');
console.log('');
console.log('🔧 Nếu có lỗi, hãy kiểm tra:');
console.log('- Frontend có chạy trên localhost:3000 không?');
console.log('- Backend có chạy trên localhost:3001 không?');
console.log('- CORS có được cấu hình đúng không?');
console.log('- Environment variables có đúng không?');
