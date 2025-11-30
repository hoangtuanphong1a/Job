// Script to create sample applications for testing

async function createSampleApplications() {
  console.log('📋 Creating sample applications...\n');

  try {
    // First, login as admin to get token
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

    // Get all users to create applications for
    const usersResponse = await fetch('http://localhost:3001/admin/users?page=1&limit=50', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (!usersResponse.ok) {
      console.log('❌ Could not fetch users');
      return;
    }

    const usersData = await usersResponse.json();
    const users = usersData.data || [];

    // Get job seekers (users with job_seeker role)
    const jobSeekers = users.filter(user =>
      user.userRoles?.some(role => role.role?.name === 'job_seeker')
    );

    // Get employers to get their jobs
    const employers = users.filter(user =>
      user.userRoles?.some(role => role.role?.name === 'employer')
    );

    console.log(`Found ${jobSeekers.length} job seekers and ${employers.length} employers`);

    // Get all jobs
    const jobsResponse = await fetch('http://localhost:3001/admin/jobs?page=1&limit=50', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (!jobsResponse.ok) {
      console.log('❌ Could not fetch jobs');
      return;
    }

    const jobsData = await jobsResponse.json();
    const jobs = jobsData.data || [];

    console.log(`Found ${jobs.length} jobs`);

    if (jobSeekers.length === 0 || jobs.length === 0) {
      console.log('⚠️ Need at least 1 job seeker and 1 job to create applications');
      return;
    }

    // Create applications
    const applicationsToCreate = [];
    const usedPairs = new Set(); // Track job-user pairs to avoid duplicates

    // Create 2-3 applications per job seeker
    for (const jobSeeker of jobSeekers.slice(0, 5)) { // Limit to first 5 job seekers
      const numApplications = Math.floor(Math.random() * 3) + 1; // 1-3 applications

      for (let i = 0; i < numApplications; i++) {
        const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
        const pairKey = `${jobSeeker.id}-${randomJob.id}`;

        if (!usedPairs.has(pairKey)) {
          usedPairs.add(pairKey);

          applicationsToCreate.push({
            jobId: randomJob.id,
            applicantId: jobSeeker.id,
            coverLetter: `Tôi rất quan tâm đến vị trí ${randomJob.title} tại công ty ${randomJob.company?.name || 'công ty của bạn'}. Với kinh nghiệm của mình, tôi tin rằng tôi có thể đóng góp tích cực cho đội ngũ của quý công ty.`,
            source: 'website'
          });
        }
      }
    }

    console.log(`📝 Creating ${applicationsToCreate.length} applications...`);

    // Group applications by job seeker so we can login once per user
    const applicationsByUser = {};
    for (const app of applicationsToCreate) {
      if (!applicationsByUser[app.applicantId]) {
        applicationsByUser[app.applicantId] = [];
      }
      applicationsByUser[app.applicantId].push(app);
    }

    // Find job seeker emails for login
    const jobSeekerEmails = {};
    for (const jobSeeker of jobSeekers) {
      jobSeekerEmails[jobSeeker.id] = jobSeeker.email;
    }

    for (const [userId, userApplications] of Object.entries(applicationsByUser)) {
      try {
        const userEmail = jobSeekerEmails[userId];
        if (!userEmail) continue;

        console.log(`\n🔐 Logging in as ${userEmail}...`);

        // Login as job seeker
        const loginResponse = await fetch('http://localhost:3001/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail,
            password: 'password123'
          }),
        });

        if (!loginResponse.ok) {
          console.log(`❌ Login failed for ${userEmail}`);
          continue;
        }

        const loginData = await loginResponse.json();
        const userToken = loginData.access_token;
        console.log(`✅ Logged in as ${userEmail}`);

        // Create applications for this user
        for (const applicationData of userApplications) {
          try {
            console.log(`📄 Creating application for job ${applicationData.jobId}...`);

            const createAppResponse = await fetch('http://localhost:3001/applications', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                jobId: applicationData.jobId,
                coverLetter: applicationData.coverLetter,
                source: applicationData.source
              })
            });

            if (createAppResponse.ok) {
              console.log(`✅ Created application for job ${applicationData.jobId}`);
            } else {
              const errorData = await createAppResponse.json();
              console.log(`❌ Failed to create application: ${errorData.message}`);
            }
          } catch (error) {
            console.log(`❌ Error creating application: ${error.message}`);
          }
        }
      } catch (error) {
        console.log(`❌ Error processing user ${userId}: ${error.message}`);
      }
    }

    // Check existing applications
    console.log('\n🔍 Checking existing applications...');
    const applicationsResponse = await fetch('http://localhost:3001/admin/applications?page=1&limit=20', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (applicationsResponse.ok) {
      const applicationsData = await applicationsResponse.json();
      console.log(`✅ Found ${applicationsData.total || 0} applications in system`);
      console.log('📊 Applications:', applicationsData.data?.slice(0, 3).map(app => ({
        id: app.id,
        status: app.status,
        jobTitle: app.job?.title,
        applicantEmail: app.jobSeekerProfile?.user?.email
      })) || []);
    } else {
      console.log('❌ Could not check applications');
    }

    console.log('\n🎉 Sample applications creation completed!');
    console.log('\n💡 To create real applications, users need to apply for jobs through the frontend.');

  } catch (error) {
    console.error('❌ Creating sample applications failed:', error.message);
  }
}

// Run the script
createSampleApplications();
