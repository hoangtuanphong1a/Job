// Script to create an admin user for testing admin functionality

async function createAdminUser() {
  console.log('Creating admin user for testing...\n');

  try {
    // Register admin account
    console.log('Registering admin account...');
    const registerResponse = await fetch('http://localhost:3001/auth/register', {
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

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Admin account registered successfully');
      console.log('   Email: admin@test.com');
      console.log('   Password: admin123');
      console.log('   Access Token:', registerData.access_token ? 'Present' : 'Missing');

      // Test login
      console.log('\nTesting admin login...');
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

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Admin login successful');
        console.log('   Token:', loginData.access_token.substring(0, 20) + '...');

        // Test admin endpoint
        console.log('\nTesting admin endpoint...');
        const adminResponse = await fetch('http://localhost:3001/admin/users?page=1&limit=5', {
          headers: {
            'Authorization': `Bearer ${loginData.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (adminResponse.ok) {
          const adminData = await adminResponse.json();
          console.log('✅ Admin endpoint working!');
          console.log(`   Found ${adminData.data?.length || 0} users`);
        } else {
          console.log('❌ Admin endpoint failed:', adminResponse.status);
          const errorText = await adminResponse.text();
          console.log('   Error:', errorText);
        }

      } else {
        console.log('❌ Admin login failed');
        const errorText = await loginResponse.text();
        console.log('Error:', errorText);
      }

    } else {
      const errorText = await registerResponse.text();
      if (errorText.includes('already exists')) {
        console.log('ℹ️ Admin account already exists');

        // Try login instead
        console.log('\nLogging in as existing admin...');
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

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          console.log('✅ Admin login successful');

          // Test admin endpoint
          console.log('\nTesting admin endpoint...');
          const adminResponse = await fetch('http://localhost:3001/admin/users?page=1&limit=5', {
            headers: {
              'Authorization': `Bearer ${loginData.access_token}`,
              'Content-Type': 'application/json'
            }
          });

          if (adminResponse.ok) {
            const adminData = await adminResponse.json();
            console.log('✅ Admin endpoint working!');
            console.log(`   Found ${adminData.data?.length || 0} users`);
          } else {
            console.log('❌ Admin endpoint failed:', adminResponse.status);
            const errorText = await adminResponse.text();
            console.log('   Error:', errorText);
          }

        } else {
          console.log('❌ Admin login failed');
          const errorText = await loginResponse.text();
          console.log('Error:', errorText);
        }

      } else {
        console.log('❌ Failed to register admin:', errorText);
      }
    }

    console.log('\n🎉 Admin user setup completed!');
    console.log('\nTo test admin functionality:');
    console.log('1. Login to frontend with: admin@test.com / admin123');
    console.log('2. Visit: http://localhost:3000/dashboard/admin');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

// Run the setup
createAdminUser();
