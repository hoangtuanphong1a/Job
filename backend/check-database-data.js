// Comprehensive Database Data Check - Check actual data in all tables
const mysql = require('mysql2/promise');

async function checkDatabaseData() {
  console.log('🔍 KIỂM TRA DỮ LIỆU THỰC TẾ TRONG TẤT CẢ BẢNG DATABASE\n');

  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'TUANPHONG',
    password: process.env.DB_PASSWORD || '123321',
    database: process.env.DB_NAME || 'cvking_db',
    connectTimeout: 5000,
  };

  let connection;

  try {
    console.log('⏳ Connecting to database...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected successfully!\n');

    // List of all tables to check
    const tables = [
      'users',
      'roles',
      'user_roles',
      'companies',
      'employer_profiles',
      'job_seeker_profiles',
      'job_seeker_education',
      'job_seeker_experience',
      'job_seeker_skills',
      'skills',
      'job_categories',
      'jobs',
      'job_skills',
      'job_tags',
      'job_job_tags',
      'applications',
      'application_events',
      'saved_jobs',
      'blogs',
      'blog_tags',
      'blog_post_tags',
      'blog_comments',
      'notifications',
      'messages',
      'message_threads',
      'thread_participants',
      'conversations',
      'cvs',
      'cv_templates',
      'files',
      'payments',
      'subscriptions',
      'subscription_plans',
      'hr_company_relationships'
    ];

    console.log('📊 CHECKING DATA IN ALL TABLES:\n');
    console.log('='.repeat(80));

    let totalTables = 0;
    let tablesWithData = 0;
    let tablesWithoutData = 0;
    let totalRecords = 0;

    for (const tableName of tables) {
      try {
        console.log(`\n📋 TABLE: ${tableName.toUpperCase()}`);
        console.log('-'.repeat(60));

        // Get record count
        const [countResult] = await connection.execute(
          `SELECT COUNT(*) as count FROM ${tableName}`
        );
        const recordCount = countResult[0].count;

        console.log(`📊 Records: ${recordCount}`);

        if (recordCount > 0) {
          tablesWithData++;
          totalRecords += recordCount;

          // Show sample data (up to 3 records)
          const limit = Math.min(recordCount, 3);
          const [sampleData] = await connection.execute(
            `SELECT * FROM ${tableName} LIMIT ${limit}`
          );

          console.log(`📋 Sample data (${limit} records):`);
          sampleData.forEach((row, index) => {
            console.log(`  ${index + 1}. ${JSON.stringify(row, null, 2).replace(/\n/g, '\n      ')}`);
          });

          // Show table structure if records exist
          const [columns] = await connection.execute(
            `DESCRIBE ${tableName}`
          );
          console.log(`🏗️  Columns (${columns.length}): ${columns.map(col => col.Field).join(', ')}`);

        } else {
          tablesWithoutData++;
          console.log(`📭 No data in this table`);

          // Still show columns for empty tables
          const [columns] = await connection.execute(
            `DESCRIBE ${tableName}`
          );
          console.log(`🏗️  Columns (${columns.length}): ${columns.map(col => col.Field).join(', ')}`);
        }

        totalTables++;

      } catch (tableError) {
        console.log(`❌ Error checking table ${tableName}:`, tableError.message);
        totalTables++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('🎯 DATABASE DATA SUMMARY');
    console.log('='.repeat(80));

    console.log(`📊 Total Tables Checked: ${totalTables}`);
    console.log(`✅ Tables with Data: ${tablesWithData}`);
    console.log(`📭 Tables without Data: ${tablesWithoutData}`);
    console.log(`📈 Total Records: ${totalRecords}`);

    console.log(`\n📋 TABLES WITH DATA (${tablesWithData}):`);
    if (tablesWithData > 0) {
      // Re-query to list tables with data
      for (const tableName of tables) {
        try {
          const [countResult] = await connection.execute(
            `SELECT COUNT(*) as count FROM ${tableName}`
          );
          if (countResult[0].count > 0) {
            console.log(`  • ${tableName}: ${countResult[0].count} records`);
          }
        } catch (e) {}
      }
    }

    console.log(`\n📭 TABLES WITHOUT DATA (${tablesWithoutData}):`);
    if (tablesWithoutData > 0) {
      // Re-query to list empty tables
      for (const tableName of tables) {
        try {
          const [countResult] = await connection.execute(
            `SELECT COUNT(*) as count FROM ${tableName}`
          );
          if (countResult[0].count === 0) {
            console.log(`  • ${tableName}: 0 records`);
          }
        } catch (e) {}
      }
    }

    console.log('\n🎉 DATABASE DATA CHECK COMPLETED!');

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (tablesWithoutData > 0) {
      console.log(`⚠️  ${tablesWithoutData} tables are empty. Consider seeding them with sample data.`);
    }
    if (tablesWithData > 0) {
      console.log(`✅ ${tablesWithData} tables have data and are ready for use.`);
    }

  } catch (error) {
    console.error('❌ Database connection failed!');
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
}

checkDatabaseData().catch(console.error);
