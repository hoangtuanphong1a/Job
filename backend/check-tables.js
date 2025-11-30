const mysql = require('mysql2/promise');

async function checkTables() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'TUANPHONG',
      password: '123321',
      database: 'cvking_db'
    });

    // Check job_seeker_profiles table structure
    const [columns] = await conn.execute('DESCRIBE job_seeker_profiles');
    console.log('job_seeker_profiles table columns:');
    columns.forEach((col, i) => {
      console.log(`${i + 1}. ${col.Field}: ${col.Type}`);
    });

    conn.end();
  } catch (error) {
    console.error('Error checking tables:', error);
  }
}

checkTables();
