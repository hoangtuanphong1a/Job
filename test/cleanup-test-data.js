// Script to clean up test data from the job portal

async function cleanupTestData() {
  console.log('🧹 Cleaning up test data from job portal...\n');

  try {
    // 1. Login as admin to get token
    console.log('1. Logging in as admin...');
    const adminLoginResponse = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@test.com',
        password: 'admin123'
      }),
    });

    if (!adminLoginResponse.ok) {
      console.log('❌ Admin login failed');
      return;
    }

    const adminLoginData = await adminLoginResponse.json();
    const adminToken = adminLoginData.access_token;
    console.log('✅ Admin login successful');

    // 2. Login as employer to get token for job operations
    console.log('\n2. Logging in as employer...');
    const employerLoginResponse = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'employer@test.com',
        password: 'password123'
      }),
    });

    let employerToken = null;
    if (employerLoginResponse.ok) {
      const employerLoginData = await employerLoginResponse.json();
      employerToken = employerLoginData.access_token;
      console.log('✅ Employer login successful');
    } else {
      console.log('ℹ️ Employer account not found or login failed, skipping job cleanup');
    }

    // 3. Delete test jobs (if employer token available)
    if (employerToken) {
      console.log('\n3. Deleting test jobs...');

      // Get all jobs first
      const jobsResponse = await fetch('http://localhost:3001/jobs', {
        headers: { 'Authorization': `Bearer ${employerToken}` }
      });

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        const jobs = jobsData.data || jobsData;

        console.log(`Found ${jobs.length} jobs`);

        // Delete jobs with test titles
        const testJobTitles = [
          'Senior Frontend Developer',
          'Backend Developer (Node.js)',
          'Full Stack Developer',
          'lập tình viên backend',
          'Test Job from Frontend Simulation',
          'Test Job Debug'
        ];

        for (const job of jobs) {
          if (testJobTitles.some(title => job.title.includes(title))) {
            console.log(`Deleting job: ${job.title} (ID: ${job.id})`);

            const deleteResponse = await fetch(`http://localhost:3001/jobs/${job.id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${employerToken}` }
            });

            if (deleteResponse.ok) {
              console.log(`✅ Deleted job: ${job.title}`);
            } else {
              console.log(`❌ Failed to delete job: ${job.title}`);
            }
          }
        }
      }
    }

    // 4. Delete test company
    if (employerToken) {
      console.log('\n4. Deleting test company...');

      const companiesResponse = await fetch('http://localhost:3001/companies/user/my-companies', {
        headers: { 'Authorization': `Bearer ${employerToken}` }
      });

      if (companiesResponse.ok) {
        const companies = await companiesResponse.json();

        for (const company of companies) {
          if (company.name === 'TechCorp Vietnam' || company.name === 'My New Company') {
            console.log(`Deleting company: ${company.name} (ID: ${company.id})`);

            const deleteResponse = await fetch(`http://localhost:3001/companies/${company.id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${employerToken}` }
            });

            if (deleteResponse.ok) {
              console.log(`✅ Deleted company: ${company.name}`);
            } else {
              console.log(`❌ Failed to delete company: ${company.name}`);
            }
          }
        }
      }
    }

    // 5. Delete test employer user (optional - uncomment if needed)
    /*
    console.log('\n5. Deleting test employer user...');
    const employerUsersResponse = await fetch('http://localhost:3001/admin/users?role=employer', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (employerUsersResponse.ok) {
      const usersData = await employerUsersResponse.json();
      const users = usersData.data || [];

      for (const user of users) {
        if (user.email === 'employer@test.com') {
          console.log(`Deleting user: ${user.email} (ID: ${user.id})`);

          const deleteResponse = await fetch(`http://localhost:3001/admin/users/${user.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
          });

          if (deleteResponse.ok) {
            console.log(`✅ Deleted user: ${user.email}`);
          } else {
            console.log(`❌ Failed to delete user: ${user.email}`);
          }
        }
      }
    }
    */

    console.log('\n🎉 Test data cleanup completed!');
    console.log('\nNote: Admin user (admin@test.com) was kept for admin access.');
    console.log('To also remove the test employer user, uncomment the user deletion section in the script.');

  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  }
}

// Run the cleanup
cleanupTestData();
