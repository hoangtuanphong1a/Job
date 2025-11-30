async function testJobCreationDetailed() {
  try {
    const loginResponse = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test-employer-crud-1764502035705@example.com',
        password: 'password123'
      })
    });
    const loginData = await loginResponse.json();
    console.log('Login status:', loginResponse.status);
    console.log('Login data keys:', Object.keys(loginData));

    if (loginData.access_token) {
      const jobResponse = await fetch('http://localhost:3001/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.access_token}`
        },
        body: JSON.stringify({
          title: 'Test Job Debug',
          companyId: '6d4dffc5-d4c0-4ad9-969e-9326169cf0c3',
          description: 'Test description',
          experienceLevel: 'mid_level'
        })
      });

      console.log('Job response status:', jobResponse.status);
      console.log('Job response ok:', jobResponse.ok);

      const jobData = await jobResponse.text();
      console.log('Job response text length:', jobData.length);
      console.log('Job response text:', jobData.substring(0, 200));

      try {
        const parsed = JSON.parse(jobData);
        console.log('Parsed job data keys:', Object.keys(parsed));
        console.log('Job ID:', parsed.id);
      } catch (e) {
        console.log('Failed to parse JSON:', e.message);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testJobCreationDetailed();
