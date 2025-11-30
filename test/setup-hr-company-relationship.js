// Script to set up HR-Company relationships for testing

async function setupHRCompanyRelationships() {
  console.log('Setting up HR-Company relationships...\n');

  try {
    // 1. Register HR user if not exists
    console.log('1. Registering HR user...');
    const hrRegisterResponse = await fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'hr@test.com',
        password: 'password123',
        role: 'hr'
      }),
    });

    let hrUser;
    if (hrRegisterResponse.ok) {
      hrUser = await hrRegisterResponse.json();
      console.log('✅ HR user registered successfully');
    } else {
      const errorText = await hrRegisterResponse.text();
      if (errorText.includes('already exists')) {
        console.log('ℹ️ HR user already exists, logging in...');

        // Login as HR
        const hrLoginResponse = await fetch('http://localhost:3001/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'hr@test.com',
            password: 'password123'
          }),
        });

        if (hrLoginResponse.ok) {
          const loginData = await hrLoginResponse.json();
          hrUser = loginData.user;
          console.log('✅ HR user logged in successfully');
        } else {
          console.log('❌ Failed to login as HR');
          return;
        }
      } else {
        console.log('❌ Failed to register HR:', errorText);
        return;
      }
    }

    // 2. Login as employer to get company
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

    if (!employerLoginResponse.ok) {
      console.log('❌ Failed to login as employer');
      const errorText = await employerLoginResponse.text();
      console.log('Error:', errorText);
      return;
    }

    const employerData = await employerLoginResponse.json();
    const employerToken = employerData.access_token;
    console.log('✅ Employer logged in successfully');

    // 3. Get employer's company
    console.log('\n3. Getting employer company...');
    const companiesResponse = await fetch('http://localhost:3001/companies/user/my-companies', {
      headers: { 'Authorization': `Bearer ${employerToken}` }
    });

    if (!companiesResponse.ok) {
      console.log('❌ Failed to get companies');
      return;
    }

    const companies = await companiesResponse.json();
    if (companies.length === 0) {
      console.log('❌ Employer has no companies');
      return;
    }

    const company = companies[0];
    console.log(`✅ Found company: ${company.name} (ID: ${company.id})`);

    // 4. Create HR-Company relationship
    console.log('\n4. Creating HR-Company relationship...');

    // Check if relationship already exists
    const checkRelationshipResponse = await fetch(`http://localhost:3001/hr-company-relationships/check/${hrUser.id}/${company.id}`, {
      headers: { 'Authorization': `Bearer ${employerToken}` }
    });

    const checkData = await checkRelationshipResponse.json();
    if (checkData.isHR) {
      console.log('ℹ️ HR-Company relationship already exists');
    } else {
      // Create the relationship
      const createRelationshipResponse = await fetch('http://localhost:3001/hr-company-relationships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${employerToken}`,
        },
        body: JSON.stringify({
          hrUserId: hrUser.id,
          companyId: company.id,
          hrRole: 'HR Specialist',
          permissions: {
            read: true,
            write: true,
            manage_applications: true,
            post_jobs: true
          }
        }),
      });

      if (createRelationshipResponse.ok) {
        const relationship = await createRelationshipResponse.json();
        console.log(`✅ HR-Company relationship created successfully (ID: ${relationship.id})`);
      } else {
        console.log('❌ Failed to create HR-Company relationship');
        const errorText = await createRelationshipResponse.text();
        console.log('Error:', errorText);
        return;
      }
    }

    // 5. Test HR access to companies
    console.log('\n5. Testing HR access to companies...');

    // Login as HR to get token
    const hrLoginResponse = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'hr@test.com',
        password: 'password123'
      }),
    });

    if (!hrLoginResponse.ok) {
      console.log('❌ Failed to login as HR for testing');
      return;
    }

    const hrLoginData = await hrLoginResponse.json();
    const hrToken = hrLoginData.access_token;

    // Test HR companies endpoint
    const hrCompaniesResponse = await fetch('http://localhost:3001/hr/companies', {
      headers: { 'Authorization': `Bearer ${hrToken}` }
    });

    if (hrCompaniesResponse.ok) {
      const hrCompanies = await hrCompaniesResponse.json();
      console.log(`✅ HR can access ${hrCompanies.length} companies:`);
      hrCompanies.forEach(comp => {
        console.log(`  - ${comp.name} (ID: ${comp.id})`);
      });
    } else {
      console.log('❌ HR cannot access companies');
      const errorText = await hrCompaniesResponse.text();
      console.log('Error:', errorText);
    }

    console.log('\n🎉 HR-Company relationship setup completed!');
    console.log('\nNow you can:');
    console.log('1. Login as HR (hr@test.com / password123)');
    console.log('2. Visit http://localhost:3000/dashboard/hr/jobs/post');
    console.log('3. Select companies and post jobs as HR');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

// Run the setup
setupHRCompanyRelationships();
