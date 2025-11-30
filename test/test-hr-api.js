// Test HR API endpoints
const API_BASE = 'http://localhost:3001';

async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json().catch(() => null);
    return { response, data };
  } catch (error) {
    console.error(`❌ Request failed for ${endpoint}:`, error.message);
    return { response: null, data: null };
  }
}

async function testHREndpoints() {
  console.log('🧑‍💼 TESTING HR API ENDPOINTS\n');
  console.log('='.repeat(80));

  let testResults = {
    passed: 0,
    failed: 0,
    total: 0
  };

  function logTest(testName, success, details = '') {
    testResults.total++;
    if (success) {
      testResults.passed++;
      console.log(`✅ ${testName}`);
      if (details) console.log(`   ${details}`);
    } else {
      testResults.failed++;
      console.log(`❌ ${testName}`);
      if (details) console.log(`   ${details}`);
    }
  }

  try {
    // First, create test users
    console.log('🔐 CREATING TEST USERS...\n');

    const timestamp = Date.now();
    const testUsers = {
      hr: `test-hr-${timestamp}@example.com`,
      employer: `test-employer-${timestamp}@example.com`,
      jobSeeker: `test-jobseeker-${timestamp}@example.com`
    };

    // Register HR user
    const registerHR = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: testUsers.hr,
        password: 'password123',
        role: 'hr'
      })
    });
    logTest('Register HR User', registerHR.response?.ok, `User ID: ${registerHR.data?.user?.id}`);

    // Register employer
    const registerEmployer = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: testUsers.employer,
        password: 'password123',
        role: 'employer'
      })
    });
    logTest('Register Employer', registerEmployer.response?.ok);

    // Register job seeker
    const registerJobSeeker = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: testUsers.jobSeeker,
        password: 'password123',
        role: 'job_seeker'
      })
    });
    logTest('Register Job Seeker', registerJobSeeker.response?.ok);

    // Login as HR
    const loginHR = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUsers.hr,
        password: 'password123'
      })
    });
    logTest('Login as HR', loginHR.response?.ok);
    const hrToken = loginHR.data?.access_token;

    // Login as employer
    const loginEmployer = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUsers.employer,
        password: 'password123'
      })
    });
    logTest('Login as Employer', loginEmployer.response?.ok);
    const employerToken = loginEmployer.data?.access_token;

    // Login as job seeker
    const loginJobSeeker = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUsers.jobSeeker,
        password: 'password123'
      })
    });
    logTest('Login as Job Seeker', loginJobSeeker.response?.ok);
    const jobSeekerToken = loginJobSeeker.data?.access_token;

    if (!hrToken || !employerToken || !jobSeekerToken) {
      console.log('❌ Cannot proceed without authentication tokens');
      return;
    }

    // ===== HR DASHBOARD =====
    console.log('\n📊 TESTING HR DASHBOARD ENDPOINTS...\n');

    // Get HR dashboard stats
    const getHRStats = await makeRequest('/hr/dashboard/stats', {
      headers: { 'Authorization': `Bearer ${hrToken}` }
    });
    logTest('Get HR Dashboard Stats', getHRStats.response?.ok, `Active Jobs: ${getHRStats.data?.activeJobs || 0}`);

    // Get HR jobs
    const getHRJobs = await makeRequest('/hr/jobs', {
      headers: { 'Authorization': `Bearer ${hrToken}` }
    });
    logTest('Get HR Jobs', getHRJobs.response?.ok, `Total: ${getHRJobs.data?.total || 0}`);

    // Get HR applications
    const getHRApplications = await makeRequest('/hr/applications', {
      headers: { 'Authorization': `Bearer ${hrToken}` }
    });
    logTest('Get HR Applications', getHRApplications.response?.ok, `Total: ${getHRApplications.data?.total || 0}`);

    // Get team members
    const getTeamMembers = await makeRequest('/hr/team', {
      headers: { 'Authorization': `Bearer ${hrToken}` }
    });
    logTest('Get Team Members', getTeamMembers.response?.ok, `Count: ${getTeamMembers.data?.length || 0}`);

    // Get upcoming interviews
    const getUpcomingInterviews = await makeRequest('/hr/interviews/upcoming', {
      headers: { 'Authorization': `Bearer ${hrToken}` }
    });
    logTest('Get Upcoming Interviews', getUpcomingInterviews.response?.ok, `Count: ${getUpcomingInterviews.data?.length || 0}`);

    // ===== REPORTS =====
    console.log('\n📈 TESTING HR REPORTS ENDPOINTS...\n');

    // Get reports overview
    const getReportsOverview = await makeRequest('/hr/reports/overview', {
      headers: { 'Authorization': `Bearer ${hrToken}` }
    });
    logTest('Get Reports Overview', getReportsOverview.response?.ok);

    // Get job performance reports
    const getJobPerformance = await makeRequest('/hr/reports/job-performance', {
      headers: { 'Authorization': `Bearer ${hrToken}` }
    });
    logTest('Get Job Performance Reports', getJobPerformance.response?.ok, `Jobs: ${getJobPerformance.data?.length || 0}`);

    // Get hiring funnel report
    const getHiringFunnel = await makeRequest('/hr/reports/hiring-funnel', {
      headers: { 'Authorization': `Bearer ${hrToken}` }
    });
    logTest('Get Hiring Funnel Report', getHiringFunnel.response?.ok);

    // ===== FINAL SUMMARY =====
    console.log('\n' + '='.repeat(80));
    console.log('🎯 HR API TESTING COMPLETED!');
    console.log('='.repeat(80));

    console.log('\n📊 FINAL TEST RESULTS:');
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📊 Total: ${testResults.total}`);
    console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

    console.log('\n🔗 HR Endpoints Tested:');
    console.log('✅ Dashboard Stats (/hr/dashboard/stats)');
    console.log('✅ Jobs Management (/hr/jobs)');
    console.log('✅ Applications Management (/hr/applications)');
    console.log('✅ Team Members (/hr/team)');
    console.log('✅ Upcoming Interviews (/hr/interviews/upcoming)');
    console.log('✅ Reports Overview (/hr/reports/overview)');
    console.log('✅ Job Performance (/hr/reports/job-performance)');
    console.log('✅ Hiring Funnel (/hr/reports/hiring-funnel)');

  } catch (error) {
    console.error('❌ HR API test suite failed:', error.message);
  }
}

// Run HR API tests
testHREndpoints();
