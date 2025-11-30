const mysql = require('mysql2/promise');

async function checkCompaniesTable() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'TUANPHONG',
    password: '123321',
    database: 'cvking_db'
  });

  const [rows] = await conn.execute('DESCRIBE companies');
  console.log('Companies table columns:');
  rows.forEach((col, i) => {
    console.log(`${i + 1}. ${col.Field}: ${col.Type}`);
  });

  await conn.end();
}

checkCompaniesTable().catch(console.error);
