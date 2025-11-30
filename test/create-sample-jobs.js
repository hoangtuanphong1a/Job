// Script to create sample jobs for testing

async function createSampleJobs() {
  console.log('Creating sample jobs for testing...\n');

  try {
    // First, login to get JWT token
    console.log('1. Logging in as employer...');
    const loginResponse = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'employer@test.com', // Use correct test email
        password: 'password123'
      }),
    });

    let token;
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      token = loginData.access_token;
      console.log('✅ Login successful as employer');
    } else {
      // Try HR user
      console.log('❌ Employer login failed, trying HR user...');
      const hrLoginResponse = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'phonghr@gmail.com',
          password: '123456'
        }),
      });

      if (!hrLoginResponse.ok) {
        console.log('❌ HR login also failed');
        const errorText = await hrLoginResponse.text();
        console.log('Error:', errorText);
        return;
      }

      const hrLoginData = await hrLoginResponse.json();
      token = hrLoginData.access_token;
      console.log('✅ Login successful as HR user');
    }

    // Get user's companies
    console.log('\n2. Getting user companies...');
    const companiesResponse = await fetch('http://localhost:3001/companies/user/my-companies', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!companiesResponse.ok) {
      console.log('❌ Failed to get companies');
      const errorText = await companiesResponse.text();
      console.log('Error:', errorText);
      return;
    }

    const companies = await companiesResponse.json();
    if (companies.length === 0) {
      console.log('❌ No companies found. Please create a company first.');
      console.log('Run: node test/create-sample-company.js');
      return;
    }

    const company = companies[0];
    console.log(`✅ Found company: ${company.name} (ID: ${company.id})`);

    // Check existing jobs
    console.log('\n3. Checking existing jobs...');
    const jobsResponse = await fetch('http://localhost:3001/jobs', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    let existingJobs = [];
    if (jobsResponse.ok) {
      const jobsData = await jobsResponse.json();
      existingJobs = jobsData.data || [];
      console.log(`Found ${existingJobs.length} existing jobs`);
    }

    if (existingJobs.length > 0) {
      console.log('✅ Jobs already exist:');
      existingJobs.slice(0, 3).forEach(job => {
        console.log(`  - ${job.title} (ID: ${job.id})`);
      });
      return;
    }

    // Create sample jobs
    console.log('\n4. Creating sample jobs...');

    const sampleJobs = [
      {
        title: 'Senior Frontend Developer',
        description: 'We are looking for a Senior Frontend Developer to join our team. You will be responsible for developing and maintaining web applications using React, TypeScript, and modern web technologies.',
        requirements: '3+ years of experience with React, TypeScript, HTML, CSS, JavaScript. Experience with state management libraries like Redux or Zustand.',
        benefits: 'Competitive salary, health insurance, flexible working hours, professional development opportunities.',
        jobType: 'full_time',
        experienceLevel: 'senior',
        minSalary: 25000000,
        maxSalary: 40000000,
        currency: 'VND',
        city: 'Ho Chi Minh City',
        country: 'Vietnam',
        remoteWork: true,
        skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
        tags: ['frontend', 'react', 'typescript']
      },
      {
        title: 'Backend Developer (Node.js)',
        description: 'Join our backend team to build scalable APIs and microservices. You will work with Node.js, Express, PostgreSQL, and cloud technologies.',
        requirements: '2+ years of experience with Node.js, REST APIs, database design. Knowledge of Docker and cloud platforms is a plus.',
        benefits: 'Competitive salary, stock options, learning budget, remote work options.',
        jobType: 'full_time',
        experienceLevel: 'mid',
        minSalary: 20000000,
        maxSalary: 35000000,
        currency: 'VND',
        city: 'Ha Noi',
        country: 'Vietnam',
        remoteWork: false,
        skills: ['Node.js', 'Express', 'PostgreSQL', 'REST API', 'Docker'],
        tags: ['backend', 'nodejs', 'api']
      },
      {
        title: 'Full Stack Developer',
        description: 'We need a Full Stack Developer who can work on both frontend and backend technologies. The ideal candidate should have experience with the MERN stack.',
        requirements: 'Experience with React, Node.js, MongoDB, Express. Understanding of DevOps practices.',
        benefits: 'Excellent salary, flexible hours, career growth opportunities, modern tech stack.',
        jobType: 'full_time',
        experienceLevel: 'mid',
        minSalary: 22000000,
        maxSalary: 38000000,
        currency: 'VND',
        city: 'Da Nang',
        country: 'Vietnam',
        remoteWork: true,
        skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
        tags: ['fullstack', 'mern', 'javascript']
      }
    ];

    for (const [index, jobData] of sampleJobs.entries()) {
      console.log(`Creating job ${index + 1}: ${jobData.title}`);

      const createJobResponse = await fetch('http://localhost:3001/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...jobData,
          companyId: company.id,
          categoryId: 1, // Assuming category ID 1 exists
        }),
      });

      if (createJobResponse.ok) {
        const newJob = await createJobResponse.json();
        console.log(`✅ Created job: ${newJob.title} (ID: ${newJob.id})`);
      } else {
        console.log(`❌ Failed to create job: ${jobData.title}`);
        const errorText = await createJobResponse.text();
        console.log('Error:', errorText);
      }
    }

    console.log('\n🎉 Sample jobs creation completed!');

  } catch (error) {
    console.error('❌ Script failed:', error.message);
  }
}

// Run the script
createSampleJobs();
