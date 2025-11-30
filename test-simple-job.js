async function testJobCreation() {
  try {
    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test-employer-crud-1764501846393@example.com',
        password: 'password123'
      })
    });
    const data = await response.json();
    console.log('Login response:', data);

    if (data.access_token) {
      const jobResponse = await fetch('http://localhost:3001/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.access_token}`
        },
        body: JSON.stringify({
          title: 'Test Job',
          companyId: '83e2bb91-7875-4fa1-b736-bcdff14722d1',
          description: 'Test description'
        })
      });
      const jobData = await jobResponse.json();
      console.log('Job creation status:', jobResponse.status);
      console.log('Job creation response:', jobData);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testJobCreation();
