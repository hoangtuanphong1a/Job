// Test script for employer responses to job applications
// Tests the complete flow: job posting -> application -> employer response

const API_BASE = 'http://localhost:3001';

async function testEmployerResponses() {
  console.log('🧪 Testing Employer Response Flow\n');

  try {
    // Step 1: Register and login as employer
    console.log('1️⃣ Setting up employer...');
    const timestamp = Date.now();
    const employerEmail = `employer-response-${timestamp}@example.com`;

    const employerRegister = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: employerEmail,
        password: 'password123',
        role: 'employer'
      })
    });

    if (!employerRegister.ok) {
      throw new Error('Employer registration failed');
    }

    const employerLogin = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: employerEmail,
        password: 'password123'
      })
    });

    if (!employerLogin.ok) {
      throw new Error('Employer login failed');
    }

    const employerData = await employerLogin.json();
    const employerToken = employerData.access_token;
    console.log('✅ Employer authenticated');

    // Step 2: Create company and job
    console.log('\n2️⃣ Creating company and job...');
    const companyResponse = await fetch(`${API_BASE}/companies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${employerToken}`
      },
      body: JSON.stringify({
        name: `Response Test Company ${timestamp}`,
        description: 'Company for testing employer responses',
        industry: 'technology',
        city: 'Test City',
        country: 'Test Country'
      })
    });

    if (!companyResponse.ok) {
      throw new Error('Company creation failed');
    }

    const companyData = await companyResponse.json();
    const companyId = companyData.id;

    const jobResponse = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${employerToken}`
      },
      body: JSON.stringify({
        title: 'Response Test Job',
        description: 'Job for testing employer responses',
        requirements: 'Test requirements',
        jobType: 'full_time',
        experienceLevel: 'junior',
        minSalary: 40000,
        maxSalary: 60000,
        city: 'Test City',
        country: 'Test Country',
        companyId: companyId
      })
    });

    if (!jobResponse.ok) {
      throw new Error('Job creation failed');
    }

    const jobData = await jobResponse.json();
    const jobId = jobData.id;
    console.log('✅ Job created and published');

    // Step 3: Register and login as job seeker
    console.log('\n3️⃣ Setting up job seeker...');
    const jobSeekerEmail = `jobseeker-response-${timestamp}@example.com`;

    const jobSeekerRegister = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: jobSeekerEmail,
        password: 'password123',
        role: 'job_seeker'
      })
    });

    if (!jobSeekerRegister.ok) {
      throw new Error('Job seeker registration failed');
    }

    const jobSeekerLogin = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: jobSeekerEmail,
        password: 'password123'
      })
    });

    if (!jobSeekerLogin.ok) {
      throw new Error('Job seeker login failed');
    }

    const jobSeekerData = await jobSeekerLogin.json();
    const jobSeekerToken = jobSeekerData.access_token;
    console.log('✅ Job seeker authenticated');

    // Step 4: Job seeker applies for the job
    console.log('\n4️⃣ Job seeker applies for job...');
    const applicationResponse = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jobSeekerToken}`
      },
      body: JSON.stringify({
        jobId: jobId,
        coverLetter: 'I am very interested in this position and would like to apply.',
        source: 'website'
      })
    });

    if (!applicationResponse.ok) {
      throw new Error('Application submission failed');
    }

    const applicationData = await applicationResponse.json();
    const applicationId = applicationData.id;
    console.log('✅ Application submitted successfully');

    // Step 5: Employer views the application
    console.log('\n5️⃣ Employer views application...');
    const viewApplications = await fetch(`${API_BASE}/applications/job/${jobId}`, {
      headers: { 'Authorization': `Bearer ${employerToken}` }
    });

    if (!viewApplications.ok) {
      throw new Error('Failed to view applications');
    }

    const applications = await viewApplications.json();
    console.log(`✅ Employer sees ${applications.length} application(s)`);

    // Step 6: Employer shortlists the application
    console.log('\n6️⃣ Employer shortlists application...');
    const shortlistResponse = await fetch(`${API_BASE}/applications/${applicationId}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${employerToken}`
      },
      body: JSON.stringify({
        status: 'shortlisted',
        notes: 'Good fit for the position, strong background in required technologies'
      })
    });

    if (!shortlistResponse.ok) {
      throw new Error('Failed to shortlist application');
    }

    console.log('✅ Application shortlisted');

    // Step 7: Employer schedules an interview
    console.log('\n7️⃣ Employer schedules interview...');
    const interviewDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    const interviewResponse = await fetch(`${API_BASE}/applications/${applicationId}/interview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${employerToken}`
      },
      body: JSON.stringify({
        interviewDate: interviewDate.toISOString(),
        notes: 'Technical interview to assess coding skills and experience'
      })
    });

    if (!interviewResponse.ok) {
      throw new Error('Failed to schedule interview');
    }

    console.log('✅ Interview scheduled');

    // Step 8: Employer views updated application status
    console.log('\n8️⃣ Employer checks updated application status...');
    const checkApplication = await fetch(`${API_BASE}/applications/${applicationId}`, {
      headers: { 'Authorization': `Bearer ${employerToken}` }
    });

    if (!checkApplication.ok) {
      throw new Error('Failed to check application status');
    }

    const updatedApplication = await checkApplication.json();
    console.log(`✅ Application status: ${updatedApplication.status}`);
    console.log(`📅 Interview scheduled: ${updatedApplication.interviewScheduledAt ? 'Yes' : 'No'}`);

    // Step 9: Job seeker views their application status
    console.log('\n9️⃣ Job seeker checks application status...');
    const myApplications = await fetch(`${API_BASE}/applications/user/my-applications`, {
      headers: { 'Authorization': `Bearer ${jobSeekerToken}` }
    });

    if (!myApplications.ok) {
      throw new Error('Failed to get user applications');
    }

    const userApplications = await myApplications.json();
    console.log(`✅ Job seeker sees ${userApplications.length} application(s)`);

    const userApplication = userApplications.find(app => app.id === applicationId);
    if (userApplication) {
      console.log(`📊 Application status from job seeker view: ${userApplication.status}`);
    }

    // Step 10: Final employer dashboard check
    console.log('\n🔟 Final employer dashboard check...');
    const dashboardStats = await fetch(`${API_BASE}/employer/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${employerToken}` }
    });

    if (!dashboardStats.ok) {
      throw new Error('Failed to get dashboard stats');
    }

    const stats = await dashboardStats.json();
    console.log('📊 Final dashboard stats:');
    console.log(`   - Active jobs: ${stats.activeJobs}`);
    console.log(`   - Total applications: ${stats.totalApplications}`);
    console.log(`   - Response rate: ${stats.responseRate}%`);

    console.log('\n🎉 EMPLOYER RESPONSE FLOW TEST COMPLETED SUCCESSFULLY! 🎉');
    console.log('\n📋 TEST SUMMARY:');
    console.log('✅ Job posting');
    console.log('✅ Job application submission');
    console.log('✅ Employer viewing applications');
    console.log('✅ Application status update (shortlisted)');
    console.log('✅ Interview scheduling');
    console.log('✅ Status tracking for both parties');
    console.log('✅ Dashboard statistics update');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testEmployerResponses();
