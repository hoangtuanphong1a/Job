// Comprehensive End-to-End HR Workflow Test
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

async function testHREndToEndWorkflow() {
  console.log('🔄 COMPREHENSIVE HR END-TO-END WORKFLOW TEST\n');
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
    const timestamp = Date.now();
    const testUsers = {
      employer: `test-employer-e2e-${timestamp}@example.com`,
      hr: `test-hr-e2e-${timestamp}@example.com`,
      jobSeeker1: `test-jobseeker1-e2e-${timestamp}@example.com`,
      jobSeeker2: `test-jobseeker2-e2e-${timestamp}@example.com`
    };

    console.log('👥 CREATING TEST USERS...\n');

    // Create employer
    const registerEmployer = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: testUsers.employer,
        password: 'password123',
        role: 'employer'
      })
    });
    logTest('Register Employer', registerEmployer.response?.ok);

    // Create HR
    const registerHR = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: testUsers.hr,
        password: 'password123',
        role: 'hr'
      })
    });
    logTest('Register HR', registerHR.response?.ok);

    // Create job seekers
    const registerJobSeeker1 = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: testUsers.jobSeeker1,
        password: 'password123',
        role: 'job_seeker'
      })
    });
    logTest('Register Job Seeker 1', registerJobSeeker1.response?.ok);

    const registerJobSeeker2 = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: testUsers.jobSeeker2,
        password: 'password123',
        role: 'job_seeker'
      })
    });
    logTest('Register Job Seeker 2', registerJobSeeker2.response?.ok);

    // Login all users
    const loginEmployer = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUsers.employer,
        password: 'password123'
      })
    });
    logTest('Login Employer', loginEmployer.response?.ok);
    const employerToken = loginEmployer.data?.access_token;
    const employerUserId = loginEmployer.data?.user?.id;

    // Get employer's company ID
    const employerCompanies = await makeRequest('/companies/user/my-companies', {
      headers: { 'Authorization': `Bearer ${employerToken}` }
    });
    logTest('Get Employer Companies', employerCompanies.response?.ok);
    const companyId = employerCompanies.data?.[0]?.id;

    const loginHR = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUsers.hr,
        password: 'password123'
      })
    });
    logTest('Login HR', loginHR.response?.ok);
    const hrToken = loginHR.data?.access_token;

    const loginJobSeeker1 = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUsers.jobSeeker1,
        password: 'password123'
      })
    });
    logTest('Login Job Seeker 1', loginJobSeeker1.response?.ok);
    const jobSeeker1Token = loginJobSeeker1.data?.access_token;

    const loginJobSeeker2 = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUsers.jobSeeker2,
        password: 'password123'
      })
    });
    logTest('Login Job Seeker 2', loginJobSeeker2.response?.ok);
    const jobSeeker2Token = loginJobSeeker2.data?.access_token;

    if (!employerToken || !hrToken || !jobSeeker1Token || !jobSeeker2Token) {
      console.log('❌ Cannot proceed without authentication tokens');
      return;
    }

    console.log('\n🏢 EMPLOYER CREATES JOB...\n');

    // First get available job categories
    const categories = await makeRequest('/job-categories');
    logTest('Get Job Categories', categories.response?.ok, `Count: ${categories.data?.length || 0}`);

    if (!categories.data || categories.data.length === 0) {
      console.log('❌ No job categories available, cannot create job');
      return;
    }

    const categoryId = categories.data[0].id; // Use first available category

    // Employer creates a job (simplified)
    const createJob = await makeRequest('/jobs', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${employerToken}` },
      body: JSON.stringify({
        title: 'Senior Frontend Developer - E2E Test',
        description: 'We are looking for a Senior Frontend Developer to join our team.',
        jobType: 'full-time',
        experienceLevel: 'senior',
        city: 'Ho Chi Minh City',
        country: 'Vietnam',
        categoryId: categoryId,
        companyId: companyId
      })
    });
    logTest('Employer Creates Job', createJob.response?.ok, `Job ID: ${createJob.data?.id}`);
    const jobId = createJob.data?.id;

    console.log('\n👤 JOB SEEKERS CREATE PROFILES...\n');

    // Job seekers create profiles
    const createProfile1 = await makeRequest('/jobseeker/profile', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${jobSeeker1Token}` },
      body: JSON.stringify({
        firstName: 'Nguyen',
        lastName: 'Developer',
        phone: '+84123456789',
        bio: 'Experienced React Developer',
        location: 'Ho Chi Minh City, Vietnam',
        experienceYears: 5,
        currentPosition: 'Senior Frontend Developer'
      })
    });
    logTest('Job Seeker 1 Creates Profile', createProfile1.response?.ok);

    const createProfile2 = await makeRequest('/jobseeker/profile', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${jobSeeker2Token}` },
      body: JSON.stringify({
        firstName: 'Tran',
        lastName: 'Coder',
        phone: '+84987654321',
        bio: 'Full-stack Developer with React expertise',
        location: 'Ha Noi, Vietnam',
        experienceYears: 3,
        currentPosition: 'Frontend Developer'
      })
    });
    logTest('Job Seeker 2 Creates Profile', createProfile2.response?.ok);

    console.log('\n📝 JOB SEEKERS APPLY TO JOB...\n');

    // Job seekers apply to the job
    const apply1 = await makeRequest('/applications', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${jobSeeker1Token}` },
      body: JSON.stringify({
        jobId: jobId,
        coverLetter: 'I am very interested in this position and have 5+ years of React experience.',
        expectedSalary: 2000,
        availableFrom: '2025-12-01'
      })
    });
    logTest('Job Seeker 1 Applies to Job', apply1.response?.ok);
    const applicationId1 = apply1.data?.id;

    const apply2 = await makeRequest('/applications', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${jobSeeker2Token}` },
      body: JSON.stringify({
        jobId: jobId,
        coverLetter: 'I would love to work on this project with my React skills.',
        expectedSalary: 1800,
        availableFrom: '2025-12-15'
      })
    });
    logTest('Job Seeker 2 Applies to Job', apply2.response?.ok);
    const applicationId2 = apply2.data?.id;

    console.log('\n👔 HR REVIEWS APPLICATIONS...\n');

    // HR gets dashboard stats
    const hrStats = await makeRequest('/hr/dashboard/stats', {
      headers: { 'Authorization': `Bearer ${hrToken}` }
    });
    logTest('HR Gets Dashboard Stats', hrStats.response?.ok, `Applications: ${hrStats.data?.totalApplications || 0}`);

    // HR gets applications
    const hrApplications = await makeRequest('/hr/applications', {
      headers: { 'Authorization': `Bearer ${hrToken}` }
    });
    logTest('HR Gets Applications', hrApplications.response?.ok, `Count: ${hrApplications.data?.data?.length || 0}`);

    // HR updates application status (shortlist first application)
    const updateStatus1 = await makeRequest(`/hr/applications/${applicationId1}/status`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${hrToken}` },
      body: JSON.stringify({
        status: 'shortlisted',
        notes: 'Strong React experience, good fit for the role'
      })
    });
    logTest('HR Shortlists Application 1', updateStatus1.response?.ok);

    // HR rejects second application
    const updateStatus2 = await makeRequest(`/hr/applications/${applicationId2}/status`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${hrToken}` },
      body: JSON.stringify({
        status: 'rejected',
        notes: 'Experience level below requirements'
      })
    });
    logTest('HR Rejects Application 2', updateStatus2.response?.ok);

    console.log('\n📅 HR SCHEDULES INTERVIEW...\n');

    // HR schedules interview for shortlisted candidate
    const scheduleInterview = await makeRequest(`/hr/applications/${applicationId1}/interview`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${hrToken}` },
      body: JSON.stringify({
        interviewDate: '2025-12-05T10:00:00.000Z',
        notes: 'Technical interview focusing on React and TypeScript'
      })
    });
    logTest('HR Schedules Interview', scheduleInterview.response?.ok);

    // HR gets upcoming interviews
    const upcomingInterviews = await makeRequest('/hr/interviews/upcoming', {
      headers: { 'Authorization': `Bearer ${hrToken}` }
    });
    logTest('HR Gets Upcoming Interviews', upcomingInterviews.response?.ok, `Count: ${upcomingInterviews.data?.length || 0}`);

    console.log('\n💬 HR SENDS MESSAGE...\n');

    // HR sends message to candidate
    const sendMessage = await makeRequest(`/hr/applications/${applicationId1}/message`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${hrToken}` },
      body: JSON.stringify({
        type: 'in_app',
        subject: 'Interview Scheduled',
        message: 'Your interview is scheduled for December 5th at 10 AM. Please confirm your availability.'
      })
    });
    logTest('HR Sends Message to Candidate', sendMessage.response?.ok);

    console.log('\n📊 HR VIEWS REPORTS...\n');

    // HR gets reports overview
    const reportsOverview = await makeRequest('/hr/reports/overview', {
      headers: { 'Authorization': `Bearer ${hrToken}` }
    });
    logTest('HR Gets Reports Overview', reportsOverview.response?.ok);

    // HR gets job performance reports
    const jobPerformance = await makeRequest('/hr/reports/job-performance', {
      headers: { 'Authorization': `Bearer ${hrToken}` }
    });
    logTest('HR Gets Job Performance Reports', jobPerformance.response?.ok);

    // HR gets hiring funnel report
    const hiringFunnel = await makeRequest('/hr/reports/hiring-funnel', {
      headers: { 'Authorization': `Bearer ${hrToken}` }
    });
    logTest('HR Gets Hiring Funnel Report', hiringFunnel.response?.ok);

    console.log('\n👥 HR VIEWS TEAM MEMBERS...\n');

    // HR gets team members
    const teamMembers = await makeRequest('/hr/team', {
      headers: { 'Authorization': `Bearer ${hrToken}` }
    });
    logTest('HR Gets Team Members', teamMembers.response?.ok, `Count: ${teamMembers.data?.length || 0}`);

    console.log('\n🎯 FINAL WORKFLOW VALIDATION...\n');

    // Validate the complete workflow
    // Check if job was created and published
    const getJob = await makeRequest(`/jobs/${jobId}`);
    logTest('Job Exists and is Accessible', getJob.response?.ok && getJob.data?.status === 'published');

    // Check if applications were created
    const getApplication1 = await makeRequest(`/applications/${applicationId1}`);
    logTest('Application 1 Status is Shortlisted', getApplication1.response?.ok && getApplication1.data?.status === 'shortlisted');

    const getApplication2 = await makeRequest(`/applications/${applicationId2}`);
    logTest('Application 2 Status is Rejected', getApplication2.response?.ok && getApplication2.data?.status === 'rejected');

    // Final summary
    console.log('\n' + '='.repeat(80));
    console.log('🎯 HR END-TO-END WORKFLOW TEST COMPLETED!');
    console.log('='.repeat(80));

    console.log('\n📊 FINAL TEST RESULTS:');
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📊 Total: ${testResults.total}`);
    console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

    console.log('\n🔄 WORKFLOW TESTED:');
    console.log('✅ User Registration & Authentication');
    console.log('✅ Employer Job Creation');
    console.log('✅ Job Seeker Profile Creation');
    console.log('✅ Job Applications');
    console.log('✅ HR Dashboard & Stats');
    console.log('✅ HR Application Management');
    console.log('✅ HR Interview Scheduling');
    console.log('✅ HR Communication with Candidates');
    console.log('✅ HR Reporting & Analytics');
    console.log('✅ HR Team Management');

    const success = testResults.failed === 0;
    console.log(`\n🎉 OVERALL RESULT: ${success ? '✅ ALL HR LOGIC WORKING CORRECTLY!' : '❌ ISSUES FOUND - NEEDS FIXING'}`);

    return success;

  } catch (error) {
    console.error('❌ HR End-to-End test failed:', error.message);
    return false;
  }
}

// Run comprehensive HR workflow test
testHREndToEndWorkflow();
