// Test script to simulate job posting from frontend and show console logs
// This simulates what happens when a user fills out the job posting form

const API_BASE = 'http://localhost:3001';

// Simulate the job posting process with detailed logging
async function simulateJobPosting() {
  console.log('🧪 SIMULATING JOB POSTING FROM FRONTEND');
  console.log('========================================');

  try {
    // Step 1: Simulate user login
    console.log('\n1️⃣ Simulating employer login...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'employer@test.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }

    const loginData = await loginResponse.json();
    const token = loginData.access_token;
    console.log('✅ Employer logged in, got token');

    // Step 2: Simulate loading companies (from loadInitialData)
    console.log('\n2️⃣ Loading user companies (simulating loadInitialData)...');
    const companiesResponse = await fetch(`${API_BASE}/companies/user/my-companies`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!companiesResponse.ok) {
      throw new Error('Failed to load companies');
    }

    const companies = await companiesResponse.json();
    console.log('Companies loaded:', companies);

    if (companies.length === 0) {
      console.log('❌ No companies found - user needs to create a company first');
      return;
    }

    const selectedCompanyId = companies[0].id;
    console.log('Auto-selected company:', companies[0].name);

    // Step 3: Simulate form data mapping (from mapFormToJobData)
    console.log('\n3️⃣ Mapping form data to job data (simulating mapFormToJobData)...');
    const formData = {
      title: "Test Job from Frontend Simulation",
      industry: "technology",
      level: "senior",
      type: "fulltime",
      location: "Ho Chi Minh City",
      description: "This is a test job created to verify frontend-backend integration and logging",
      requirements: "Test requirements",
      benefits: "Test benefits",
      salaryMin: "20000000",
      salaryMax: "35000000",
      contactName: "Test HR",
      contactEmail: "hr@testcompany.com",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      skills: ["JavaScript", "React"]
    };

    console.log('📝 Form data:', formData);

    // Map form values to backend enums (same logic as in frontend)
    const jobTypeMap = {
      fulltime: "full_time",
      parttime: "part_time",
      remote: "contract",
      contract: "contract",
      internship: "internship",
    };

    const experienceLevelMap = {
      intern: "entry_level",
      junior: "junior",
      middle: "mid_level",
      senior: "senior",
      lead: "lead",
      manager: "executive",
    };

    const mappedJobData = {
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements || undefined,
      benefits: formData.benefits || undefined,
      jobType: jobTypeMap[formData.type] || "full_time",
      experienceLevel: experienceLevelMap[formData.level] || "mid_level",
      minSalary: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
      maxSalary: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
      city: formData.location,
      country: "Vietnam",
      companyId: selectedCompanyId,
      expiresAt: formData.deadline || undefined,
      skillIds: [] // Simplified - not converting skills in this test
    };

    console.log('📝 Mapped job data:', mappedJobData);

    // Step 4: Simulate the API call (from jobService.createJob)
    console.log('\n4️⃣ Making API call to create job (simulating jobService.createJob)...');
    console.log('🔧 jobService.createJob called with data:', mappedJobData);
    console.log('📡 Making API call to POST /jobs...');

    const jobResponse = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(mappedJobData)
    });

    console.log('✅ API call completed, response status:', jobResponse.status);

    if (jobResponse.ok) {
      const createdJob = await jobResponse.json();
      console.log('📋 API response data:', createdJob);
      console.log('✅ Job creation API call completed');
      console.log('📋 Returned job data:', createdJob);
      console.log('🆔 Job ID:', createdJob?.id);
      console.log('📄 Job Title:', createdJob?.title);
      console.log('🏢 Company:', createdJob?.company?.name);
      console.log('📊 Job Status:', createdJob?.status);

      console.log('\n🎉 JOB POSTING SUCCESSFUL!');
      console.log('✅ Job created and returned properly');
      console.log('🔄 Would redirect to /jobs with refresh parameter');

      // Step 5: Verify job appears in listings
      console.log('\n5️⃣ Verifying job appears in public listings...');
      const jobsResponse = await fetch(`${API_BASE}/jobs?page=1&limit=10`);

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        const jobs = jobsData.data || [];
        const ourJob = jobs.find(job => job.id === createdJob.id);

        if (ourJob) {
          console.log('✅ Job found in public listings!');
          console.log('📋 Job in listings:', {
            id: ourJob.id,
            title: ourJob.title,
            company: ourJob.company?.name,
            status: ourJob.status
          });
        } else {
          console.log('⚠️ Job not found in public listings');
        }
      }

    } else {
      const errorData = await jobResponse.json();
      console.log('❌ Job creation failed!');
      console.log('❌ Error response:', errorData);
      console.log('❌ Error status:', jobResponse.status);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Instructions for user
console.log('📋 HƯỚNG DẪN KIỂM TRA LOGS KHI ĐĂNG JOB:');
console.log('========================================');
console.log('1. Mở trình duyệt và truy cập: http://localhost:3002/jobs/post');
console.log('2. Đăng nhập với tài khoản employer');
console.log('3. Điền form và nhấn "Đăng tin tuyển dụng"');
console.log('4. Mở Developer Tools (F12) → Console tab');
console.log('5. Xem các logs chi tiết về quá trình đăng job');
console.log('');
console.log('🔍 LOGS SẼ HIỆN:');
console.log('- 🚀 Starting job posting process');
console.log('- 📝 Mapped job data');
console.log('- 🔧 jobService.createJob called');
console.log('- 📡 Making API call to POST /jobs');
console.log('- ✅ API call successful + response data');
console.log('- 🆔 Job ID, Title, Company, Status');
console.log('- 🔄 Redirecting to jobs page');
console.log('');

// Run the simulation
simulateJobPosting();
