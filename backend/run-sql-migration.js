const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runSQLMigration() {
  console.log('🔧 Running SQL Migration...\n');

  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'TUANPHONG',
    password: process.env.DB_PASSWORD || '123321',
    database: process.env.DB_NAME || 'cvking_db',
    connectTimeout: 5000,
    multipleStatements: true,
  };

  console.log('📍 Connection Config:');
  console.log(`   Host: ${config.host}:${config.port}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Database: ${config.database}`);
  console.log('');

  let connection;

  try {
    console.log('⏳ Attempting to connect...');
    connection = await mysql.createConnection(config);
    console.log('✅ Successfully connected to MySQL database!\n');

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'add-missing-company-columns.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('📄 Executing SQL migration...');
    console.log('SQL Content:');
    console.log(sqlContent);
    console.log('');

    // Execute the SQL
    const [results] = await connection.execute(sqlContent);

    console.log('✅ SQL migration executed successfully!');
    console.log('Results:', results);

    // Verify the changes
    console.log('\n🔍 Verifying changes...');
    const [describeResults] = await connection.execute('DESCRIBE companies');
    console.log('Updated companies table structure:');
    describeResults.forEach((column, index) => {
      console.log(`${index + 1}. ${column.Field}: ${column.Type}`);
    });

  } catch (error) {
    console.error('❌ SQL migration failed!');
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
    });
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }

  console.log('\n🎉 SQL migration completed!');
}

runSQLMigration().catch(console.error);
