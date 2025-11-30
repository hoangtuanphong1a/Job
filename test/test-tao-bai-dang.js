// Test script for creating job posts (tạo bài đăng)

async function testTaoBaiDang() {
  console.log('🚀 Testing Tạo Bài Đăng (Job Post Creation)...\n');

  const API_BASE = 'http://localhost:3001';

  try {
    // Step 1: Login để lấy JWT token
    console.log('1️⃣ 🔐 Đăng nhập để lấy JWT token...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'employer@test.com',
        password: 'password123'
      }),
    });

    if (!loginResponse.ok) {
      console.log('❌ Đăng nhập thất bại!');
      console.log('Status:', loginResponse.status);
      const error = await loginResponse.text();
      console.log('Lỗi:', error);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Đăng nhập thành công!');
    console.log('User:', loginData.user.email);
    console.log('Token:', loginData.access_token.substring(0, 50) + '...');

    const token = loginData.access_token;

    // Step 2: Lấy company hiện có
    console.log('\n2️⃣ 🏢 Lấy thông tin công ty...');
    const companiesResponse = await fetch(`${API_BASE}/companies/user/my-companies`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    let companyId;
    if (companiesResponse.ok) {
      const companies = await companiesResponse.json();
      if (companies.length > 0) {
        companyId = companies[0].id;
        console.log('✅ Tìm thấy công ty:', companies[0].name);
        console.log('Company ID:', companyId);
      } else {
        console.log('❌ Không tìm thấy công ty nào. Vui lòng tạo công ty trước.');
        return;
      }
    } else {
      console.log('❌ Không thể lấy danh sách công ty');
      const error = await companiesResponse.text();
      console.log('Lỗi:', error);
      return;
    }

    // Step 3: Tạo bài đăng job
    console.log('\n3️⃣ 💼 Tạo bài đăng job...');

    const jobData = {
      title: 'Frontend Developer - React/TypeScript',
      description: 'Chúng tôi đang tìm kiếm một Frontend Developer có kinh nghiệm với React và TypeScript để tham gia dự án mới.',
      requirements: '2+ năm kinh nghiệm với React, TypeScript, HTML/CSS. Có kiến thức về Next.js là một lợi thế.',
      benefits: 'Lương cạnh tranh, bảo hiểm sức khỏe, giờ làm việc linh hoạt, cơ hội thăng tiến',
      jobType: 'full_time',
      experienceLevel: 'mid_level',
      salaryType: 'monthly',
      minSalary: 18000000,
      maxSalary: 30000000,
      currency: 'VND',
      city: 'Hà Nội',
      country: 'Việt Nam',
      remoteWork: true,
      companyId: companyId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 ngày từ bây giờ
    };

    console.log('📝 Dữ liệu bài đăng:');
    console.log('- Tiêu đề:', jobData.title);
    console.log('- Loại công việc:', jobData.jobType);
    console.log('- Mức lương:', jobData.minSalary.toLocaleString('vi-VN') + ' - ' + jobData.maxSalary.toLocaleString('vi-VN'), jobData.currency);
    console.log('- Thành phố:', jobData.city);
    console.log('- Remote work:', jobData.remoteWork ? 'Có' : 'Không');

    const jobResponse = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });

    console.log('\n📡 Phản hồi tạo bài đăng:');
    console.log('Status:', jobResponse.status);

    if (jobResponse.ok) {
      const jobResult = await jobResponse.json();
      console.log('✅ Tạo bài đăng thành công!');
      console.log('🆔 Job ID:', jobResult.id);
      console.log('📋 Tiêu đề:', jobResult.title);
      console.log('📊 Trạng thái:', jobResult.status);
      console.log('🏢 Công ty:', jobResult.company?.name);
      console.log('📅 Ngày tạo:', new Date(jobResult.createdAt).toLocaleString('vi-VN'));

      const jobId = jobResult.id;

      // Step 4: Kiểm tra bài đăng vừa tạo
      console.log('\n4️⃣ 🔍 Kiểm tra bài đăng vừa tạo...');
      const getJobResponse = await fetch(`${API_BASE}/jobs/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (getJobResponse.ok) {
        const jobDetails = await getJobResponse.json();
        console.log('✅ Lấy thông tin bài đăng thành công!');
        console.log('📋 Tiêu đề:', jobDetails.title);
        console.log('💰 Mức lương:', jobDetails.minSalary?.toLocaleString('vi-VN') + ' - ' + jobDetails.maxSalary?.toLocaleString('vi-VN'), jobDetails.currency);
        console.log('📍 Địa điểm:', jobDetails.city + ', ' + jobDetails.country);
        console.log('🏠 Remote work:', jobDetails.remoteWork ? 'Có' : 'Không');
        console.log('⏰ Hạn nộp:', new Date(jobDetails.expiresAt).toLocaleDateString('vi-VN'));
      } else {
        console.log('⚠️ Không thể lấy thông tin bài đăng');
        console.log('Status:', getJobResponse.status);
      }

      // Step 5: Kiểm tra danh sách jobs để xác nhận bài đăng mới
      console.log('\n5️⃣ 📋 Kiểm tra danh sách bài đăng...');
      const jobsResponse = await fetch(`${API_BASE}/jobs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        const totalJobs = jobsData.data?.length || 0;
        console.log('✅ Tổng số bài đăng:', totalJobs);

        // Tìm bài đăng vừa tạo trong danh sách
        const newJob = jobsData.data?.find(job => job.id === jobId);
        if (newJob) {
          console.log('✅ Bài đăng mới xuất hiện trong danh sách!');
          console.log('📊 Status trong danh sách:', newJob.status);
        }
      } else {
        console.log('⚠️ Không thể lấy danh sách bài đăng');
      }

    } else {
      console.log('❌ Tạo bài đăng thất bại!');
      const error = await jobResponse.text();
      console.log('Lỗi:', error);
    }

  } catch (error) {
    console.error('❌ Test thất bại:', error.message);
  }
}

// Hàm kiểm tra server
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3001/health');
    return response.ok;
  } catch {
    return false;
  }
}

// Chạy test
async function runTest() {
  console.log('='.repeat(60));
  console.log('🧪 TEST TẠO BÀI ĐĂNG - CVKing Job Posting System');
  console.log('='.repeat(60));

  // Kiểm tra server
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('❌ Server backend chưa chạy!');
    console.log('Vui lòng khởi động server bằng lệnh: cd backend && npm run start:dev');
    return;
  }

  console.log('✅ Server backend đang chạy\n');

  // Chạy test tạo bài đăng
  await testTaoBaiDang();

  console.log('\n' + '='.repeat(60));
  console.log('📚 API Documentation: http://localhost:3001/api');
  console.log('🔐 Nhớ thêm header: Authorization: Bearer YOUR_TOKEN');
  console.log('='.repeat(60));
}

// Chạy test
runTest();
