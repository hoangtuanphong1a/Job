const mysql = require('mysql2/promise');

async function checkJobs() {
  let connection;

  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'job_portal',
      port: process.env.DB_PORT || 3306,
    });

    console.log('Connected to database');

    // Check jobs table
    const [jobs] = await connection.execute(
      'SELECT id, title, status, company_id FROM jobs LIMIT 10'
    );

    console.log('\nJobs in database:');
    if (jobs.length === 0) {
      console.log('No jobs found in database');

      // Check if companies exist
      const [companies] = await connection.execute(
        'SELECT id, name, owner_id FROM companies LIMIT 5'
      );

      console.log('\nCompanies in database:');
      if (companies.length === 0) {
        console.log('No companies found. Please create sample data first.');
        console.log('Run: node test/create-sample-company.js');
      } else {
        console.log('Companies found:', companies.length);
        companies.forEach(company => {
          console.log(`- ID: ${company.id}, Name: ${company.name}, Owner: ${company.owner_id}`);
        });

        console.log('\nTo create sample jobs, you may need to create job postings first.');
        console.log('You can use the employer dashboard to create jobs, or create a script to do so.');
      }
    } else {
      console.log(`Found ${jobs.length} jobs:`);
      jobs.forEach(job => {
        console.log(`- ID: ${job.id}, Title: ${job.title}, Status: ${job.status}, Company: ${job.company_id}`);
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkJobs();
