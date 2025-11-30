// Script to create job seeker users for testing

async function createJobSeekerUsers() {
  console.log('👥 Creating job seeker users...\n');

  try {
    // First, login as admin to get token
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
      console.log('❌ Admin login failed');
      return;
    }

    const adminLoginData = await adminLoginResponse.json();
    const adminToken = adminLoginData.access_token;
    console.log('✅ Admin login successful');

    // Create job seeker users
    const jobSeekersToCreate = [
      {
        email: 'john.doe@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'job_seeker'
      },
      {
        email: 'jane.smith@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'job_seeker'
      },
      {
        email: 'bob.wilson@example.com',
        password: 'password123',
        firstName: 'Bob',
        lastName: 'Wilson',
        role: 'job_seeker'
      },
      {
        email: 'alice.brown@example.com',
        password: 'password123',
        firstName: 'Alice',
        lastName: 'Brown',
        role: 'job_seeker'
      },
      {
        email: 'charlie.johnson@example.com',
        password: 'password123',
        firstName: 'Charlie',
        lastName: 'Johnson',
        role: 'job_seeker'
      }
    ];

    console.log(`📝 Creating ${jobSeekersToCreate.length} job seeker users...`);

    for (const userData of jobSeekersToCreate) {
      try {
        console.log(`Creating user: ${userData.email}`);

        const createUserResponse = await fetch('http://localhost:3001/admin/users', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        if (createUserResponse.ok) {
          console.log(`✅ Created user: ${userData.email}`);
        } else {
          const errorData = await createUserResponse.json();
          console.log(`❌ Failed to create user ${userData.email}:`, errorData.message);
        }
      } catch (error) {
        console.log(`❌ Error creating user ${userData.email}:`, error.message);
      }
    }

    // Verify users were created
    console.log('\n🔍 Verifying job seeker users...');
    const usersResponse = await fetch('http://localhost:3001/admin/users?page=1&limit=50', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      const jobSeekers = usersData.data?.filter(user =>
        user.userRoles?.some(role => role.role?.name === 'job_seeker')
      ) || [];

      console.log(`✅ Found ${jobSeekers.length} job seeker users:`);
      jobSeekers.forEach(user => {
        console.log(`  - ${user.firstName} ${user.lastName} (${user.email})`);
      });
    } else {
      console.log('❌ Could not verify users');
    }

    console.log('\n🎉 Job seeker users creation completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Run create-sample-applications.js to create applications');
    console.log('2. Test admin applications page at http://localhost:3000/dashboard/admin/applications');

  } catch (error) {
    console.error('❌ Creating job seeker users failed:', error.message);
  }
}

// Run the script
createJobSeekerUsers();
