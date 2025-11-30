// Test script để kiểm tra kết nối frontend-backend
// Chạy script này để kiểm tra xem frontend có thể kết nối được với backend không

async function testFrontendConnection() {
  console.log('🧪 Kiểm tra kết nối Frontend-Backend...\n');

  const API_BASE = 'http://localhost:3001';

  try {
    // Test 1: Kiểm tra backend có chạy không
    console.log('1️⃣ Kiểm tra backend...');
    try {
      const response = await fetch(`${API_BASE}/api`);
      if (response.ok) {
        console.log('✅ Backend đang chạy và Swagger hoạt động');
      } else {
        console.log('⚠️ Backend có thể chạy nhưng Swagger không truy cập được');
      }
    } catch (error) {
      console.log('❌ Backend không chạy hoặc không truy cập được');
      console.log('Error:', error.message);
      return;
    }

    // Test 2: Kiểm tra API jobs
    console.log('\n2️⃣ Kiểm tra API /jobs...');
    try {
      const jobsResponse = await fetch(`${API_BASE}/jobs?page=1&limit=10`);
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        console.log('✅ API /jobs hoạt động');
        console.log(`📊 Tìm thấy ${jobsData.data?.length || 0} jobs`);
        console.log(`📈 Tổng số jobs: ${jobsData.total || 0}`);

        if (jobsData.data && jobsData.data.length > 0) {
          console.log('📋 Sample job đầu tiên:');
          console.log(`   - ID: ${jobsData.data[0].id}`);
          console.log(`   - Title: ${jobsData.data[0].title}`);
          console.log(`   - Company: ${jobsData.data[0].company?.name}`);
          console.log(`   - Status: ${jobsData.data[0].status}`);
        }
      } else {
        console.log('❌ API /jobs không hoạt động');
        console.log('Status:', jobsResponse.status, jobsResponse.statusText);
        const errorText = await jobsResponse.text();
        console.log('Error response:', errorText);
      }
    } catch (error) {
      console.log('❌ Lỗi khi gọi API /jobs');
      console.log('Error:', error.message);
    }

    // Test 3: Kiểm tra CORS
    console.log('\n3️⃣ Kiểm tra CORS headers...');
    try {
      const corsResponse = await fetch(`${API_BASE}/jobs`, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'GET',
        }
      });

      console.log('CORS preflight status:', corsResponse.status);
      const corsHeaders = corsResponse.headers;
      console.log('Access-Control-Allow-Origin:', corsHeaders.get('Access-Control-Allow-Origin'));
      console.log('Access-Control-Allow-Credentials:', corsHeaders.get('Access-Control-Allow-Credentials'));
    } catch (error) {
      console.log('⚠️ CORS preflight check failed (có thể bình thường):', error.message);
    }

    // Test 4: Giả lập request từ frontend
    console.log('\n4️⃣ Giả lập request từ frontend...');
    try {
      const frontendResponse = await fetch(`${API_BASE}/jobs`, {
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000',
        }
      });

      console.log('Frontend-like request status:', frontendResponse.status);

      if (frontendResponse.ok) {
        const data = await frontendResponse.json();
        console.log('✅ Frontend có thể kết nối với backend!');
        console.log(`📊 Jobs nhận được: ${data.data?.length || 0}`);
      } else {
        console.log('❌ Frontend không thể kết nối với backend');
        console.log('Response:', await frontendResponse.text());
      }
    } catch (error) {
      console.log('❌ Lỗi kết nối từ frontend:', error.message);
    }

  } catch (error) {
    console.error('❌ Test thất bại:', error.message);
  }
}

// Chạy test
testFrontendConnection();
