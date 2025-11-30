// Simple script to create HR-company relationship manually
// Run this after ensuring the server is running

const API_BASE = 'http://localhost:3001';

async function createHRRelationship() {
  try {
    console.log('Creating HR-Company relationship...\n');

    // Step 1: Register HR user
    console.log('1. Registering HR user...');
    const hrRegister = await fetch(`${API_BASE}/auth/register`, {
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
    if (hrRegister.ok) {
      hrUser = await hrRegister.json();
      console.log('✅ HR user registered');
    } else {
      const error = await hrRegister.text();
      if (error.includes('already exists')) {
        console.log('ℹ️ HR user already exists, logging in...');

        // Login as HR
        const hrLogin = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'hr@test.com',
            password: 'password123'
          }),
        });

        if (hrLogin.ok) {
          const loginData = await hrLogin.json();
          hrUser = loginData.user;
          console.log('✅ HR user logged in');
        } else {
          console.log('❌ Failed to login as HR');
          return;
        }
      } else {
        console.log('❌ Failed to register HR:', error);
        return;
      }
    }

    // Step 2: Login as employer and get company
    console.log('\n2. Getting employer company...');
    const employerLogin = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'employer@test.com',
        password: 'password123'
      }),
    });

    if (!employerLogin.ok) {
      console.log('❌ Failed to login as employer');
      return;
    }

    const employerData = await employerLogin.json();
    const employerToken = employerData.access_token;

    const companiesResponse = await fetch(`${API_BASE}/companies/user/my-companies`, {
      headers: { 'Authorization': `Bearer ${employerToken}` }
    });

    if (!companiesResponse.ok) {
      console.log('❌ Failed to get companies');
      return;
    }

    const companies = await companiesResponse.json();
    if (companies.length === 0) {
      console.log('❌ No companies found for employer');
      return;
    }

    const company = companies[0];
    console.log(`✅ Found company: ${company.name} (${company.id})`);

    // Step 3: Try to create relationship
    console.log('\n3. Creating HR-Company relationship...');

    // Check if endpoint exists first
    const testEndpoint = await fetch(`${API_BASE}/hr-company-relationships`, {
      method: 'OPTIONS',
      headers: { 'Authorization': `Bearer ${employerToken}` }
    });

    console.log('Endpoint check status:', testEndpoint.status);

    // Try to create relationship
    const relationshipResponse = await fetch(`${API_BASE}/hr-company-relationships`, {
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

    if (relationshipResponse.ok) {
      const relationship = await relationshipResponse.json();
      console.log(`✅ Relationship created: ${relationship.id}`);
    } else {
      const error = await relationshipResponse.text();
      console.log('❌ Failed to create relationship:', error);

      // Try alternative approach - maybe the server needs to be restarted
      console.log('\n💡 Suggestion: Make sure the backend server is running and restarted after adding the HRCompanyRelationshipModule');
      console.log('   Try: cd backend && npm run start:dev');
    }

    // Step 4: Test HR companies endpoint
    console.log('\n4. Testing HR companies access...');

    const hrLogin = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'hr@test.com',
        password: 'password123'
      }),
    });

    if (hrLogin.ok) {
      const hrLoginData = await hrLogin.json();
      const hrToken = hrLoginData.access_token;

      const hrCompaniesResponse = await fetch(`${API_BASE}/hr/companies`, {
        headers: { 'Authorization': `Bearer ${hrToken}` }
      });

      if (hrCompaniesResponse.ok) {
        const hrCompanies = await hrCompaniesResponse.json();
        console.log(`✅ HR can access ${hrCompanies.length} companies:`);
        hrCompanies.forEach(comp => {
          console.log(`   - ${comp.name} (${comp.id})`);
        });
      } else {
        console.log('❌ HR cannot access companies:', await hrCompaniesResponse.text());
      }
    }

  } catch (error) {
    console.error('❌ Script failed:', error.message);
  }
}

createHRRelationship();
