// Comprehensive script to set up test data for job portal

async function setupTestData() {
  console.log('Setting up test data for job portal...\n');

  try {
    // 1. Register employer account
    console.log('1. Registering employer account...');
    const registerResponse = await fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'employer@test.com',
        password: 'password123',
        role: 'employer'
      }),
    });

    if (registerResponse.ok) {
      console.log('✅ Employer account registered successfully');
    } else {
      const errorText = await registerResponse.text();
      if (errorText.includes('already exists')) {
        console.log('ℹ️ Employer account already exists');
      } else {
        console.log('❌ Failed to register employer:', errorText);
        return;
      }
    }

    // 2. Login to get JWT token
    console.log('\n2. Logging in as employer...');
    const loginResponse = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'employer@test.com',
        password: 'password123'
      }),
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed');
      const errorText = await loginResponse.text();
      console.log('Error:', errorText);
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.access_token;
    console.log('✅ Login successful, got JWT token');

    // 3. Create company if not exists
    console.log('\n3. Checking/creating company...');
    const companiesResponse = await fetch('http://localhost:3001/companies/user/my-companies', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    let company;
    if (companiesResponse.ok) {
      const companies = await companiesResponse.json();
      if (companies.length > 0) {
        company = companies[0];
        console.log(`✅ Company already exists: ${company.name} (ID: ${company.id})`);
      } else {
        // Create company
        console.log('Creating company...');
        const createCompanyResponse = await fetch('http://localhost:3001/companies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: 'TechCorp Vietnam',
            description: 'Leading technology company in Vietnam',
            website: 'https://techcorp.vn',
            industry: 'Technology',
            size: '51-200',
            city: 'Ho Chi Minh City',
            country: 'Vietnam',
            phone: '+84 123 456 789',
            email: 'contact@techcorp.vn'
          }),
        });

        if (createCompanyResponse.ok) {
          company = await createCompanyResponse.json();
          console.log(`✅ Company created: ${company.name} (ID: ${company.id})`);
        } else {
          console.log('❌ Failed to create company');
          const errorText = await createCompanyResponse.text();
          console.log('Error:', errorText);
          return;
        }
      }
    } else {
      console.log('❌ Failed to check companies');
      return;
    }

    // 4. Create sample jobs
    console.log('\n4. Creating sample jobs...');

    // Check existing jobs first
    const jobsResponse = await fetch('http://localhost:3001/jobs', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    let existingJobs = [];
    if (jobsResponse.ok) {
      const jobsData = await jobsResponse.json();
      existingJobs = jobsData.data || [];
    }

    if (existingJobs.length > 0) {
      console.log(`✅ ${existingJobs.length} jobs already exist`);
      existingJobs.slice(0, 3).forEach(job => {
        console.log(`  - ${job.title} (ID: ${job.id})`);
      });
      console.log('\n🎉 Setup completed! You can now test the application.');
      return;
    }

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

    const createdJobs = [];
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
        createdJobs.push(newJob);
        console.log(`✅ Created job: ${newJob.title} (ID: ${newJob.id})`);
      } else {
        console.log(`❌ Failed to create job: ${jobData.title}`);
        const errorText = await createJobResponse.text();
        console.log('Error:', errorText);
      }
    }

    console.log(`\n🎉 Setup completed! Created ${createdJobs.length} jobs.`);
    console.log('\nYou can now:');
    console.log('1. Visit http://localhost:3000/jobs to browse jobs');
    console.log('2. Click "Ứng tuyển" on any job to test the application form');
    console.log('3. Login as HR to manage applications');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

// Run the setup
setupTestData();
