const mysql = require('mysql2/promise');

async function getJobId() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'TUANPHONG',
      password: '123321',
      database: 'cvking_db'
    });

    const [rows] = await conn.execute('SELECT id, title FROM jobs WHERE status = "published" LIMIT 1');
    console.log('Job found:', rows[0]);

    conn.end();
    return rows[0]?.id;
  } catch (error) {
    console.error('Error getting job ID:', error);
    return null;
  }
}

getJobId();
