const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testEmployerDashboard() {
  console.log('🧪 Testing Employer Dashboard Endpoints\n');

  try {
    // First, register a test employer user
    const timestamp = Date.now();
    const email = `employer-test-${timestamp}@example.com`;
    console.log('📝 Registering test employer...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: email,
      password: 'password123',
      role: 'employer',
    });
    console.log('✅ Registration successful');

    // Login to get token
    console.log('🔑 Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: email,
      password: 'password123',
    });

    const authToken = loginResponse.data.access_token;
    const userId = loginResponse.data.user.id;
    console.log('✅ Login successful, User ID:', userId);

    const config = {
      headers: { Authorization: `Bearer ${authToken}` },
    };

    // Create a company for the employer
    console.log('🏢 Creating company...');
    const companyName = `Test Company ${timestamp}`;
    const companyResponse = await axios.post(`${BASE_URL}/companies`, {
      name: companyName,
      description: 'A test company for dashboard testing',
      industry: 'technology',
      website: 'https://testcompany.com',
      city: 'Test City',
      country: 'Test Country',
      size: 'small',
    }, config);

    const companyId = companyResponse.data.id;
    console.log('✅ Company created, ID:', companyId);

    // Create a job
    console.log('💼 Creating job...');
    const jobResponse = await axios.post(`${BASE_URL}/jobs`, {
      title: 'Test Job Position',
      description: 'This is a test job for dashboard testing',
      requirements: 'Test requirements',
      jobType: 'full_time',
      experienceLevel: 'junior',
      city: 'Test City',
      country: 'Test Country',
      minSalary: 50000,
      maxSalary: 70000,
      currency: 'USD',
      skillIds: [],
      tagIds: [],
      companyId: companyId,
    }, config);

    const jobId = jobResponse.data.id;
    console.log('✅ Job created, ID:', jobId);

    // Job is already published by default, no need to publish again
    console.log('✅ Job created and published by default');

    // Now test the employer dashboard endpoints
    console.log('\n📊 Testing Employer Dashboard Endpoints');

    // Test stats endpoint
    console.log('📈 Testing GET /employer/dashboard/stats...');
    const statsResponse = await axios.get(`${BASE_URL}/employer/dashboard/stats`, config);
    console.log('✅ Stats endpoint working:', statsResponse.data);

    // Test jobs endpoint
    console.log('💼 Testing GET /employer/dashboard/jobs...');
    const jobsResponse = await axios.get(`${BASE_URL}/employer/dashboard/jobs?limit=5`, config);
    console.log('✅ Jobs endpoint working, found', jobsResponse.data.length, 'jobs');

    // Test applicants endpoint
    console.log('👥 Testing GET /employer/dashboard/applicants...');
    const applicantsResponse = await axios.get(`${BASE_URL}/employer/dashboard/applicants?limit=5`, config);
    console.log('✅ Applicants endpoint working, found', applicantsResponse.data.length, 'applicants');

    // Now test the application submission process by creating a job seeker and applying
    console.log('\n🔄 Testing application submission process...');

    // Create a job seeker user
    const jobSeekerEmail = `jobseeker-test-${timestamp}@example.com`;
    console.log('👤 Registering job seeker...');
    const jobSeekerRegisterResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: jobSeekerEmail,
      password: 'password123',
      role: 'job_seeker',
    });
    console.log('✅ Job seeker registration successful');

    // Login as job seeker
    console.log('🔑 Job seeker logging in...');
    const jobSeekerLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: jobSeekerEmail,
      password: 'password123',
    });
    const jobSeekerToken = jobSeekerLoginResponse.data.access_token;
    console.log('✅ Job seeker login successful');

    const jobSeekerConfig = {
      headers: { Authorization: `Bearer ${jobSeekerToken}` },
    };

    // Try to apply for the job
    console.log('📝 Submitting application...');
    try {
      const applicationResponse = await axios.post(`${BASE_URL}/applications`, {
        jobId: jobId,
        coverLetter: 'I am very interested in this position and believe I have the skills required.',
        source: 'website'
      }, jobSeekerConfig);
      console.log('✅ Application submitted successfully:', applicationResponse.data);
    } catch (applicationError) {
      console.error('❌ Application submission failed:', applicationError.response?.data || applicationError.message);
    }

    // Check if applications are now showing up in employer dashboard
    console.log('🔄 Rechecking employer dashboard after application...');
    const updatedStatsResponse = await axios.get(`${BASE_URL}/employer/dashboard/stats`, config);
    console.log('📊 Updated stats:', updatedStatsResponse.data);

    const updatedApplicantsResponse = await axios.get(`${BASE_URL}/employer/dashboard/applicants?limit=5`, config);
    console.log('👥 Updated applicants:', updatedApplicantsResponse.data.length, 'applicants found');

    console.log('\n🎉 Application submission test completed!');

  } catch (error) {
    console.error('\n❌ Test failed:');
    console.error('Error:', error.response?.data || error.message);
    if (error.response?.status) {
      console.error('Status Code:', error.response.status);
    }
  }
}

testEmployerDashboard();
