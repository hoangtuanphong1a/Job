// Create Sample Job Categories

async function createSampleJobCategories() {
  console.log('🚀 Creating Sample Job Categories...\n');

  try {
    // First login to get token
    console.log('1️⃣ 🔐 LOGIN - Getting JWT token...');
    const loginResponse = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@cvking.com',
        password: 'admin123'
      })
    });

    let token;
    if (!loginResponse.ok) {
      console.log('❌ Admin login failed, trying employer account...');

      // Try employer account instead
      const employerLogin = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'employer@test.com',
          password: 'password123'
        })
      });

      if (!employerLogin.ok) {
        console.log('❌ Employer login also failed!');
        console.log('💡 Make sure the server is running and accounts exist');
        return;
      }

      const employerData = await employerLogin.json();
      token = employerData.access_token;
      console.log('✅ Employer login successful!');
    } else {
      const loginData = await loginResponse.json();
      token = loginData.access_token;
      console.log('✅ Admin login successful!');
    }

    // Sample job categories to create
    const sampleCategories = [
      { name: 'Software Development', description: 'Roles related to software engineering, programming, and development' },
      { name: 'Data Science & Analytics', description: 'Data analysis, machine learning, AI, and business intelligence roles' },
      { name: 'DevOps & Infrastructure', description: 'System administration, cloud engineering, and deployment roles' },
      { name: 'Product Management', description: 'Product strategy, roadmap planning, and stakeholder management' },
      { name: 'UI/UX Design', description: 'User interface and user experience design roles' },
      { name: 'Quality Assurance', description: 'Software testing, QA engineering, and quality control' },
      { name: 'Project Management', description: 'Project coordination, delivery management, and team leadership' },
      { name: 'Business Analysis', description: 'Requirements gathering, process analysis, and business consulting' },
      { name: 'Marketing & Sales', description: 'Digital marketing, sales, and customer acquisition roles' },
      { name: 'Human Resources', description: 'Talent acquisition, employee relations, and HR operations' },
      { name: 'Finance & Accounting', description: 'Financial analysis, accounting, and financial operations' },
      { name: 'Customer Support', description: 'Customer service, technical support, and client relations' },
      { name: 'Operations & Logistics', description: 'Supply chain, operations management, and logistics' },
      { name: 'Research & Development', description: 'Innovation, research, and product development' },
      { name: 'Education & Training', description: 'Teaching, training, and educational content creation' },
      { name: 'Healthcare & Medical', description: 'Healthcare administration, medical roles, and wellness' },
      { name: 'Legal & Compliance', description: 'Legal affairs, regulatory compliance, and risk management' },
      { name: 'Creative & Media', description: 'Content creation, media production, and creative design' },
      { name: 'Consulting', description: 'Professional services, advisory, and consulting roles' },
      { name: 'Executive Leadership', description: 'C-suite positions, executive management, and strategic leadership' }
    ];

    console.log('\n2️⃣ 📝 CREATING SAMPLE JOB CATEGORIES...');

    let createdCount = 0;
    let failedCount = 0;
    const createdCategories = [];

    for (const category of sampleCategories) {
      try {
        const createResponse = await fetch('http://localhost:3001/job-categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(category)
        });

        if (createResponse.ok) {
          const createdCategory = await createResponse.json();
          createdCount++;
          createdCategories.push(createdCategory);
          console.log(`✅ Created: ${category.name}`);
        } else {
          const errorText = await createResponse.text();
          failedCount++;
          console.log(`❌ Failed: ${category.name} - ${errorText}`);
        }
      } catch (error) {
        failedCount++;
        console.log(`❌ Error creating ${category.name}:`, error.message);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('🎉 SAMPLE JOB CATEGORIES CREATION COMPLETED!');
    console.log('='.repeat(80));
    console.log(`✅ Successfully created: ${createdCount} categories`);
    console.log(`❌ Failed to create: ${failedCount} categories`);
    console.log(`📊 Total categories attempted: ${sampleCategories.length}`);

    if (createdCategories.length > 0) {
      console.log('\n📋 CREATED CATEGORIES:');
      createdCategories.forEach((cat, index) => {
        console.log(`  ${index + 1}. ${cat.name}`);
        console.log(`     ID: ${cat.id}`);
        console.log(`     Description: ${cat.description}`);
        console.log('');
      });

      console.log('\n💡 TIP: Use these category IDs when creating job postings!');
      console.log('   Example: "categoryId": "' + createdCategories[0].id + '"');
    }

  } catch (error) {
    console.error('❌ Script failed:', error.message);
  }
}

// Run script
createSampleJobCategories();
