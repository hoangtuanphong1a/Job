async function checkJobsAPI() {
  console.log('Checking jobs via API...\n');

  try {
    // Try to get jobs from API
    console.log('1. Fetching jobs from API...');
    const response = await fetch('http://localhost:3001/jobs');

    if (!response.ok) {
      console.log('❌ Failed to fetch jobs from API');
      console.log('Status:', response.status);
      const errorText = await response.text();
      console.log('Error:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ API call successful');

    if (data.data && Array.isArray(data.data)) {
      console.log(`\nFound ${data.data.length} jobs in API response:`);
      if (data.data.length === 0) {
        console.log('No jobs found. You may need to create sample jobs.');
        console.log('\nTo create sample jobs:');
        console.log('1. Login to the application as an employer');
        console.log('2. Go to the dashboard and create job postings');
        console.log('3. Or create a script to generate sample jobs');
      } else {
        data.data.slice(0, 5).forEach((job, index) => {
          console.log(`${index + 1}. ID: ${job.id}, Title: ${job.title}, Company: ${job.company?.name}, Status: ${job.status}`);
        });

        if (data.data.length > 5) {
          console.log(`... and ${data.data.length - 5} more jobs`);
        }
      }
    } else {
      console.log('Unexpected API response format:', data);
    }

  } catch (error) {
    console.error('❌ Error checking jobs API:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure the backend server is running: cd backend && npm run start:dev');
    console.log('2. Check if the backend is running on port 3001');
    console.log('3. Check backend logs for any errors');
  }
}

// Run the check
checkJobsAPI();
