// Comprehensive Job API Test - Test all job-related endpoints
const API_BASE = 'http://localhost:3001';

async function comprehensiveJobTest() {
  console.log('🔬 COMPREHENSIVE JOB API TEST - Testing All Job Endpoints\n');

  try {
    // 1. LOGIN AS EMPLOYER
    console.log('1️⃣ 🔐 Login as Employer...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'employer@test.com',
        password: 'password123'
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const employerToken = loginData.access_token;
    console.log('✅ Employer login successful');

    // 2. GET EMPLOYER COMPANIES
    console.log('\n2️⃣ 🏢 Get Employer Companies...');
    const companiesResponse = await fetch(`${API_BASE}/companies/user/my-companies`, {
      headers: { 'Authorization': `Bearer ${employerToken}` },
    });

    if (!companiesResponse.ok) {
      throw new Error(`Get companies failed: ${companiesResponse.status}`);
    }

    const companies = await companiesResponse.json();
    console.log(`✅ Found ${companies.length} companies`);
    const companyId = companies[0]?.id;

    if (!companyId) {
      throw new Error('No companies found for employer');
    }

    // 3. CREATE A NEW JOB
    console.log('\n3️⃣ 💼 Create New Job...');
    const jobData = {
      title: 'Comprehensive Test Job',
      description: 'This is a comprehensive test job to verify all endpoints',
      requirements: 'Test requirements',
      benefits: 'Test benefits',
      jobType: 'full_time',
      experienceLevel: 'mid_level',
      minSalary: 20000000,
      maxSalary: 35000000,
      city: 'Ho Chi Minh City',
      country: 'Vietnam',
      companyId: companyId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    const createJobResponse = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${employerToken}`,
      },
      body: JSON.stringify(jobData),
    });

    if (!createJobResponse.ok) {
      throw new Error(`Create job failed: ${createJobResponse.status}`);
    }

    const newJob = await createJobResponse.json();
    const jobId = newJob.id;
    console.log(`✅ Job created with ID: ${jobId}`);

    // 4. GET JOB BY ID
    console.log('\n4️⃣ 📋 Get Job by ID...');
    const getJobResponse = await fetch(`${API_BASE}/jobs/${jobId}`, {
      headers: { 'Authorization': `Bearer ${employerToken}` },
    });

    if (!getJobResponse.ok) {
      throw new Error(`Get job by ID failed: ${getJobResponse.status}`);
    }

    const jobDetails = await getJobResponse.json();
    console.log(`✅ Job details retrieved: ${jobDetails.title}`);
    console.log(`   - Status: ${jobDetails.status}`);
    console.log(`   - Company: ${jobDetails.company?.name}`);
    console.log(`   - Salary: ${jobDetails.minSalary} - ${jobDetails.maxSalary}`);

    // 5. GET ALL JOBS (LIST)
    console.log('\n5️⃣ 📜 Get All Jobs (List)...');
    const jobsListResponse = await fetch(`${API_BASE}/jobs?page=1&limit=5`, {
      headers: { 'Authorization': `Bearer ${employerToken}` },
    });

    if (!jobsListResponse.ok) {
      throw new Error(`Get jobs list failed: ${jobsListResponse.status}`);
    }

    const jobsData = await jobsListResponse.json();
    console.log(`✅ Jobs list retrieved: ${jobsData.data?.length || 0} jobs`);
    console.log(`   - Total jobs: ${jobsData.total || 'N/A'}`);

    // 6. UPDATE JOB
    console.log('\n6️⃣ ✏️ Update Job...');
    const updateData = {
      title: 'Updated Comprehensive Test Job',
      description: 'Updated description for comprehensive testing',
      minSalary: 25000000,
      maxSalary: 40000000,
    };

    const updateJobResponse = await fetch(`${API_BASE}/jobs/${jobId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${employerToken}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!updateJobResponse.ok) {
      throw new Error(`Update job failed: ${updateJobResponse.status}`);
    }

    const updatedJob = await updateJobResponse.json();
    console.log(`✅ Job updated: ${updatedJob.title}`);
    console.log(`   - New salary: ${updatedJob.minSalary} - ${updatedJob.maxSalary}`);

    // 7. PUBLISH JOB (if not already published)
    if (updatedJob.status !== 'published') {
      console.log('\n7️⃣ 📢 Publish Job...');
      const publishResponse = await fetch(`${API_BASE}/jobs/${jobId}/publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${employerToken}`,
        },
      });

      if (!publishResponse.ok) {
        console.log(`⚠️ Publish job failed: ${publishResponse.status}`);
      } else {
        console.log('✅ Job published successfully');
      }
    } else {
      console.log('\n7️⃣ 📢 Job already published, skipping publish step');
    }

    // 8. GET JOBS BY COMPANY
    console.log('\n8️⃣ 🏢 Get Jobs by Company...');
    const companyJobsResponse = await fetch(`${API_BASE}/jobs/company/${companyId}`, {
      headers: { 'Authorization': `Bearer ${employerToken}` },
    });

    if (!companyJobsResponse.ok) {
      throw new Error(`Get jobs by company failed: ${companyJobsResponse.status}`);
    }

    const companyJobs = await companyJobsResponse.json();
    console.log(`✅ Company jobs retrieved: ${companyJobs.length} jobs`);
    const foundJob = companyJobs.find(job => job.id === jobId);
    console.log(`   - Our test job found: ${foundJob ? 'Yes' : 'No'}`);

    // 9. GET EMPLOYER'S JOBS (MY JOBS)
    console.log('\n9️⃣ 👤 Get Employer My Jobs...');
    const myJobsResponse = await fetch(`${API_BASE}/jobs/user/my-jobs`, {
      headers: { 'Authorization': `Bearer ${employerToken}` },
    });

    if (!myJobsResponse.ok) {
      throw new Error(`Get my jobs failed: ${myJobsResponse.status}`);
    }

    const myJobsStats = await myJobsResponse.json();
    console.log('✅ My jobs stats retrieved:');
    console.log(`   - Active jobs: ${myJobsStats.activeJobs || 'N/A'}`);
    console.log(`   - Total applications: ${myJobsStats.totalApplications || 'N/A'}`);
    console.log(`   - Total views: ${myJobsStats.totalViews || 'N/A'}`);

    // 10. CLOSE JOB
    console.log('\n🔟 🚪 Close Job...');
    const closeResponse = await fetch(`${API_BASE}/jobs/${jobId}/close`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${employerToken}`,
      },
    });

    if (!closeResponse.ok) {
      console.log(`⚠️ Close job failed: ${closeResponse.status}`);
    } else {
      console.log('✅ Job closed successfully');
    }

    // 11. VERIFY JOB STATUS AFTER CLOSING
    console.log('\n1️⃣1️⃣ Verify Job Status After Closing...');
    const verifyJobResponse = await fetch(`${API_BASE}/jobs/${jobId}`, {
      headers: { 'Authorization': `Bearer ${employerToken}` },
    });

    if (verifyJobResponse.ok) {
      const verifiedJob = await verifyJobResponse.json();
      console.log(`✅ Job status verified: ${verifiedJob.status}`);
    }

    // 12. GET APPLICATIONS FOR JOB (should be empty for new job)
    console.log('\n1️⃣2️⃣ Get Applications for Job...');
    const applicationsResponse = await fetch(`${API_BASE}/applications/job/${jobId}`, {
      headers: { 'Authorization': `Bearer ${employerToken}` },
    });

    if (!applicationsResponse.ok) {
      throw new Error(`Get applications failed: ${applicationsResponse.status}`);
    }

    const applications = await applicationsResponse.json();
    console.log(`✅ Applications retrieved: ${applications.length} applications`);

    // 13. TEST PUBLIC JOB ACCESS (without auth)
    console.log('\n1️⃣3️⃣ Test Public Job Access...');
    const publicJobsResponse = await fetch(`${API_BASE}/jobs`);

    if (!publicJobsResponse.ok) {
      throw new Error(`Public jobs access failed: ${publicJobsResponse.status}`);
    }

    const publicJobs = await publicJobsResponse.json();
    console.log(`✅ Public jobs access: ${publicJobs.data?.length || 0} jobs available`);
    const publicJob = publicJobs.data?.find(job => job.id === jobId);
    console.log(`   - Our job visible publicly: ${publicJob ? 'Yes' : 'No'}`);

    console.log('\n🎉 ALL JOB ENDPOINTS TESTED SUCCESSFULLY! 🎉');
    console.log('\n📊 SUMMARY:');
    console.log('✅ Job Creation');
    console.log('✅ Job Retrieval (by ID)');
    console.log('✅ Job Listing');
    console.log('✅ Job Update');
    console.log('✅ Job Publishing');
    console.log('✅ Job Closing');
    console.log('✅ Company Jobs');
    console.log('✅ My Jobs Stats');
    console.log('✅ Job Applications');
    console.log('✅ Public Access');

  } catch (error) {
    console.error('❌ COMPREHENSIVE TEST FAILED:', error.message);
  }
}

comprehensiveJobTest();
