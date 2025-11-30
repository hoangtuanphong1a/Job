const mysql = require('mysql2/promise');

async function updatePassword() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'TUANPHONG',
      password: '123321',
      database: 'cvking_db'
    });

    // Update jobseeker password to the correct hash
    const correctHash = '$2b$12$DqiDcZ8F4lkc5Jjav0M0qun2tEMYBqWeOAnN09t37d0dIolC6/OYW';
    await conn.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [correctHash, 'jobseeker@example.com']
    );

    console.log('✅ Updated jobseeker password');

    // Also update other users if needed
    await conn.execute(
      'UPDATE users SET password = ? WHERE email IN (?, ?, ?)',
      [correctHash, 'employer@example.com', 'hr@example.com', 'admin@example.com']
    );

    console.log('✅ Updated all user passwords');

    conn.end();
  } catch (error) {
    console.error('Error updating password:', error);
  }
}

updatePassword();
