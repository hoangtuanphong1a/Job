const mysql = require('mysql2/promise');

async function checkCVTable() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'TUANPHONG',
      password: '123321',
      database: 'cvking_db'
    });

    // Check cvs table structure
    const [columns] = await conn.execute('DESCRIBE cvs');
    console.log('cvs table columns:');
    columns.forEach((col, i) => {
      console.log(`${i + 1}. ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : ''} ${col.Default ? `default: ${col.Default}` : ''}`);
    });

    conn.end();
  } catch (error) {
    console.error('Error checking cvs table:', error);
  }
}

checkCVTable();
