const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

async function createJobSeekerProfile() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'TUANPHONG',
      password: '123321',
      database: 'cvking_db'
    });

    // Get the jobseeker user ID
    const [users] = await conn.execute('SELECT id FROM users WHERE email = ?', ['jobseeker@example.com']);
    if (users.length === 0) {
      console.error('Jobseeker user not found');
      return;
    }

    const userId = users[0].id;
    console.log('Jobseeker user ID:', userId);

    // Check if profile already exists
    const [profiles] = await conn.execute('SELECT id FROM job_seeker_profiles WHERE user_id = ?', [userId]);

    if (profiles.length > 0) {
      console.log('Job seeker profile already exists:', profiles[0].id);
      conn.end();
      return;
    }

    // Create job seeker profile
    const profileId = uuidv4();
    await conn.execute(
      `INSERT INTO job_seeker_profiles (id, user_id, profileCompletion, lastUpdatedAt, createdAt, updatedAt)
       VALUES (?, ?, ?, NOW(), NOW(), NOW())`,
      [profileId, userId, 20]
    );

    console.log('✅ Created job seeker profile:', profileId);

    conn.end();
  } catch (error) {
    console.error('Error creating job seeker profile:', error);
  }
}

createJobSeekerProfile();
