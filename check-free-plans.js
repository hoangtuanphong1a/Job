const mysql = require('mysql2/promise');

async function check() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'TUANPHONG',
      password: '123321',
      database: 'cvking_db'
    });

    const [rows] = await conn.execute('SELECT * FROM subscription_plans WHERE plan_type = "FREE" AND is_active = 1');
    console.log('Free plans:', rows);

    const [allPlans] = await conn.execute('SELECT * FROM subscription_plans');
    console.log('All plans:', allPlans);

    conn.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

check();
