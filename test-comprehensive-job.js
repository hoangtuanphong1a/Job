async function testComprehensiveJob() {
  try {
    // Login first
    const loginResponse = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test-employer-crud-1764501961096@example.com',
        password: 'password123'
      })
    });
    const loginData = await loginResponse.json();
    console.log('Login successful:', loginData.access_token ? 'YES' : 'NO');

    if (!loginData.access_token) return;

    // Get categories and skills
    const [catRes, skillRes, companyRes] = await Promise.all([
      fetch('http://localhost:3001/job-categories'),
      fetch('http://localhost:3001/skills'),
      fetch('http://localhost:3001/companies/user/my-companies', {
        headers: { 'Authorization': `Bearer ${loginData.access_token}` }
      })
    ]);

    const categories = await catRes.json();
    const skills = await skillRes.json();
    const companies = await companyRes.json();

    console.log('Categories:', categories.length, 'Skills:', skills.length, 'Companies:', companies.length);

    if (companies.length === 0) {
      console.log('No companies found');
      return;
    }

    const companyId = companies[0].id;
    const categoryId = categories.length > 0 ? categories[0].id : null;
    const skillIds = skills.length > 0 ? [skills[0].id] : [];

    console.log('Using company:', companyId, 'category:', categoryId, 'skills:', skillIds);

    // Create job
    const jobData = {
      title: 'Test Job Comprehensive',
      companyId: companyId,
      description: "Test job for CRUD operations",
      requirements: "Test requirements",
      jobType: "full_time",
      experienceLevel: "mid_level",
      minSalary: 50000,
      maxSalary: 80000,
      city: "Hanoi",
      country: "Vietnam",
      remoteWork: false,
      categoryId: categoryId,
      skillIds: skillIds,
    };

    console.log('Sending job data:', JSON.stringify(jobData, null, 2));

    const jobResponse = await fetch('http://localhost:3001/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.access_token}`
      },
      body: JSON.stringify(jobData)
    });

    const jobResult = await jobResponse.json();
    console.log('Job creation status:', jobResponse.status);
    console.log('Job creation result:', jobResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

testComprehensiveJob();
