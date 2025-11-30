const axios = require('axios');

async function testApplication() {
  try {
    // First, let's try to login as a job seeker to get a token
    const loginResponse = await axios.post('http://localhost:3001/auth/login', {
      email: 'jobseeker@example.com',
      password: '123321'
    });

    const token = loginResponse.data.accessToken;
    console.log('✅ Login successful, got token');

    // Now try to create an application
    const applicationData = {
      jobId: '07f937e3-6391-4ccf-80cd-d0e809479839', // Real job ID
      coverLetter: 'Test application from automated script',
      source: 'WEBSITE'
    };

    const response = await axios.post('http://localhost:3001/applications', applicationData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Application created successfully:', response.data);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    if (error.response?.data?.message) {
      console.error('Error message:', error.response.data.message);
    }
  }
}

testApplication();
