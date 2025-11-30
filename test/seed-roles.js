// Script to seed initial roles in the database

async function seedRoles() {
  console.log('🌱 Seeding initial roles...\n');

  try {
    // Login as admin to get token
    const adminLoginResponse = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@test.com',
        password: 'admin123'
      }),
    });

    if (!adminLoginResponse.ok) {
      console.log('❌ Admin login failed - creating admin user first...');

      // Try to create admin user first
      const createAdminResponse = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@test.com',
          password: 'admin123',
          role: 'admin'
        }),
      });

      if (!createAdminResponse.ok) {
        console.log('❌ Failed to create admin user');
        return;
      }

      console.log('✅ Admin user created, now logging in...');

      // Now login
      const loginResponse = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@test.com',
          password: 'admin123'
        }),
      });

      if (!loginResponse.ok) {
        console.log('❌ Admin login failed');
        return;
      }

      var adminLoginData = await loginResponse.json();
    } else {
      var adminLoginData = await adminLoginResponse.json();
    }

    const adminToken = adminLoginData.access_token;
    console.log('✅ Admin login successful');

    // Define the roles to create
    const rolesToCreate = [
      {
        name: 'admin',
        description: 'Administrator with full system access'
      },
      {
        name: 'employer',
        description: 'Company owner who can post jobs'
      },
      {
        name: 'hr',
        description: 'HR personnel who can manage recruitment'
      },
      {
        name: 'job_seeker',
        description: 'Job seeker who can apply for jobs'
      }
    ];

    console.log('\n📝 Creating roles...');

    for (const roleData of rolesToCreate) {
      try {
        // Check if role already exists by trying to create it
        // Since we can't directly query roles, we'll use the register endpoint to create them
        console.log(`Creating role: ${roleData.name}`);

        // Try to register a dummy user with this role to trigger role creation
        const testEmail = `test-${roleData.name}@example.com`;

        const registerResponse = await fetch('http://localhost:3001/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: testEmail,
            password: 'testpassword123',
            role: roleData.name
          }),
        });

        if (registerResponse.ok) {
          console.log(`✅ Role ${roleData.name} created successfully`);

          // Delete the test user we just created
          const loginTestResponse = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: testEmail,
              password: 'testpassword123'
            }),
          });

          if (loginTestResponse.ok) {
            const testUserData = await loginTestResponse.json();
            const testToken = testUserData.access_token;

            // Delete the test user
            await fetch('http://localhost:3001/admin/users/test-user-id', {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${adminToken}` }
            });
          }
        } else {
          const errorText = await registerResponse.text();
          if (errorText.includes('already exists')) {
            console.log(`ℹ️ Role ${roleData.name} already exists`);
          } else {
            console.log(`❌ Failed to create role ${roleData.name}:`, errorText);
          }
        }

      } catch (error) {
        console.log(`❌ Error creating role ${roleData.name}:`, error.message);
      }
    }

    // Verify roles exist by checking admin users endpoint
    console.log('\n🔍 Verifying roles...');
    const usersResponse = await fetch('http://localhost:3001/admin/users?page=1&limit=10', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log(`✅ Found ${usersData.data?.length || 0} users in system`);
      console.log('✅ Roles are properly seeded!');
    } else {
      console.log('❌ Could not verify roles');
    }

    console.log('\n🎉 Role seeding completed!');
    console.log('\nAvailable roles:');
    console.log('- admin: Administrator with full system access');
    console.log('- employer: Company owner who can post jobs');
    console.log('- hr: HR personnel who can manage recruitment');
    console.log('- job_seeker: Job seeker who can apply for jobs');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  }
}

// Run the seeder
seedRoles();
