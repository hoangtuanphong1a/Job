// Quick API test for job posting flow
const API_BASE = 'http://localhost:3001';

async function testAPI() {
  console.log('🧪 Testing Job Posting API Flow...\n');

  try {
    // Test 1: Login
    console.log('1️⃣ Testing Login...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'employer@test.com',
        password: 'password123'
      }),
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed:', loginResponse.status);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    const token = loginData.access_token;

    // Test 2: Get companies
    console.log('\n2️⃣ Testing Get Companies...');
    const companiesResponse = await fetch(`${API_BASE}/companies/user/my-companies`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!companiesResponse.ok) {
      console.log('❌ Get companies failed:', companiesResponse.status);
      return;
    }

    const companies = await companiesResponse.json();
    console.log('✅ Companies fetched:', companies.length);

    if (companies.length === 0) {
      console.log('❌ No companies found');
      return;
    }

    const companyId = companies[0].id;

    // Test 3: Create job
    console.log('\n3️⃣ Testing Create Job...');
    const jobData = {
      title: 'Test Frontend Developer',
      description: 'Test job description',
      requirements: 'Test requirements',
      jobType: 'full_time',
      experienceLevel: 'mid_level',
      minSalary: 15000000,
      maxSalary: 25000000,
      city: 'Hanoi',
      country: 'Vietnam',
      companyId: companyId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    const jobResponse = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });

    if (!jobResponse.ok) {
      console.log('❌ Create job failed:', jobResponse.status);
      const error = await jobResponse.text();
      console.log('Error:', error);
      return;
    }

    const jobResult = await jobResponse.json();
    console.log('✅ Job created:', jobResult.id);

    // Test 4: Get jobs list
    console.log('\n4️⃣ Testing Get Jobs List...');
    const jobsResponse = await fetch(`${API_BASE}/jobs`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!jobsResponse.ok) {
      console.log('❌ Get jobs failed:', jobsResponse.status);
      return;
    }

    const jobsData = await jobsResponse.json();
    console.log('✅ Jobs fetched:', jobsData.data?.length || 0);

    // Test 5: Apply for job (as jobseeker)
    console.log('\n5️⃣ Testing Job Application...');

    // Login as jobseeker
    const jobseekerLogin = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'jobseeker@test.com',
        password: 'password123'
      }),
    });

    if (!jobseekerLogin.ok) {
      console.log('❌ Jobseeker login failed:', jobseekerLogin.status);
      return;
    }

    const jobseekerData = await jobseekerLogin.json();
    const jobseekerToken = jobseekerData.access_token;

    // Apply for job
    const applicationData = {
      jobId: jobResult.id,
      coverLetter: 'Test application'
    };

    const applicationResponse = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jobseekerToken}`,
      },
      body: JSON.stringify(applicationData),
    });

    if (!applicationResponse.ok) {
      console.log('❌ Application failed:', applicationResponse.status);
      const error = await applicationResponse.text();
      console.log('Error:', error);
    } else {
      const applicationResult = await applicationResponse.json();
      console.log('✅ Application submitted:', applicationResult.id);
    }

    // Test 6: Get applications for job (as employer)
    console.log('\n6️⃣ Testing Get Applications...');
    const employerApplicationsResponse = await fetch(`${API_BASE}/applications/job/${jobResult.id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!employerApplicationsResponse.ok) {
      console.log('❌ Get applications failed:', employerApplicationsResponse.status);
    } else {
      const applications = await employerApplicationsResponse.json();
      console.log('✅ Applications fetched:', applications.length);
    }

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();
