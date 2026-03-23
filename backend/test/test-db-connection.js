const mysql = require('mysql2/promise');

async function testConnection() {
  const config = {
    host: process.env.DB_HOST || 'centerbeam.proxy.rlwy.net',
    port: parseInt(process.env.DB_PORT || '13926'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'TokExscZiEiqyXnCgCkFmxXGobgmQqTM',
    database: process.env.DB_NAME || 'railway',
    connectTimeout: 5000,
  };

  console.log('🔍 Testing database connection...');
  console.log('📍 Config:', {
    host: config.host,
    port: config.port,
    user: config.user,
    database: config.database,
  });

  let connection;

  try {
    console.log('⏳ Attempting to connect...');
    connection = await mysql.createConnection(config);
    console.log('✅ Successfully connected to MySQL!');

    // Test query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Test query successful:', rows);

    // Check if database exists
    const [databases] = await connection.execute('SHOW DATABASES');
    const dbExists = databases.some((db) => db.Database === config.database);
    console.log(
      `📊 Database '${config.database}' ${dbExists ? 'EXISTS' : 'DOES NOT EXIST'}`,
    );

    if (dbExists) {
      // Check tables
      const [tables] = await connection.execute('SHOW TABLES');
      console.log(`📋 Found ${tables.length} tables in database`);
    }
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
    });

    // Provide troubleshooting tips
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure MySQL server is running');
    console.log('2. Check if the database exists: CREATE DATABASE cvking_db;');
    console.log('3. Verify firewall settings');
    console.log('4. Check MySQL user permissions');
    console.log('5. Try connecting without database first');

    // Try connecting without database
    try {
      console.log('\n⏳ Testing connection without database...');
      const noDbConfig = { ...config };
      delete noDbConfig.database;
      const testConnection = await mysql.createConnection(noDbConfig);
      console.log('✅ MySQL server connection OK, but database may not exist');
      await testConnection.end();
    } catch (noDbError) {
      console.log('❌ Cannot connect to MySQL server at all');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connection closed');
    }
  }
}

testConnection().catch(console.error);
