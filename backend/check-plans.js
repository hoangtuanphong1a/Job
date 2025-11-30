const mysql = require('mysql2/promise');

async function check() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'TUANPHONG',
      password: '123321',
      database: 'cvking_db'
    });

    // Check table structure first
    const [columns] = await conn.execute('DESCRIBE subscription_plans');
    console.log('Subscription plans table columns:');
    columns.forEach((col, i) => {
      console.log(`${i + 1}. ${col.Field}: ${col.Type}`);
    });

    const [rows] = await conn.execute('SELECT * FROM subscription_plans WHERE planType = "FREE" AND isActive = 1');
    console.log('Free plans:', rows);

    const [allPlans] = await conn.execute('SELECT * FROM subscription_plans');
    console.log('All plans:', allPlans);

    conn.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

check();
