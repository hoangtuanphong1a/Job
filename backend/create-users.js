const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

async function createUsers() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'TUANPHONG',
      password: '123321',
      database: 'cvking_db'
    });

    // Password hash for '123321'
    const passwordHash = '$2b$12$DqiDcZ8F4lkc5Jjav0M0qun2tEMYBqWeOAnN09t37d0dIolC6/OYW';

    // Insert users
    const users = [
      {
        id: uuidv4(),
        email: 'admin@example.com',
        password: passwordHash,
        firstName: 'Admin',
        lastName: 'User',
        status: 'active',
        isActive: true
      },
      {
        id: uuidv4(),
        email: 'employer@example.com',
        password: passwordHash,
        firstName: 'John',
        lastName: 'Employer',
        status: 'active',
        isActive: true
      },
      {
        id: uuidv4(),
        email: 'hr@example.com',
        password: passwordHash,
        firstName: 'Sarah',
        lastName: 'HR',
        status: 'active',
        isActive: true
      },
      {
        id: uuidv4(),
        email: 'jobseeker@example.com',
        password: passwordHash,
        firstName: 'Mike',
        lastName: 'Developer',
        status: 'active',
        isActive: true
      }
    ];

    for (const user of users) {
      await conn.execute(
        `INSERT INTO users (id, email, password, firstName, lastName, status, isActive, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE
         password = VALUES(password),
         firstName = VALUES(firstName),
         lastName = VALUES(lastName)`,
        [user.id, user.email, user.password, user.firstName, user.lastName, user.status, user.isActive]
      );
    }

    console.log('✅ Created/updated users');

    // Check created users
    const [rows] = await conn.execute('SELECT id, email, firstName, lastName FROM users WHERE email IN (?, ?, ?, ?)',
      ['admin@example.com', 'employer@example.com', 'hr@example.com', 'jobseeker@example.com']);

    console.log('Created users:');
    rows.forEach(user => {
      console.log(`- ${user.email}: ${user.firstName} ${user.lastName} (ID: ${user.id})`);
    });

    conn.end();
  } catch (error) {
    console.error('Error creating users:', error);
  }
}

createUsers();
