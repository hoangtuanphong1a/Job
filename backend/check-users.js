const mysql = require('mysql2/promise');

async function checkUsers() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'TUANPHONG',
      password: '123321',
      database: 'cvking_db'
    });

    const [rows] = await conn.execute('SELECT id, email, password, firstName, lastName FROM users');
    console.log('Users in database:');
    rows.forEach((user, i) => {
      console.log(`${i + 1}. ${user.email} - ${user.firstName} ${user.lastName} - Password starts with: ${user.password.substring(0, 20)}...`);
    });

    conn.end();
  } catch (error) {
    console.error('Error checking users:', error);
  }
}

checkUsers();
