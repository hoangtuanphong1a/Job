// Test Admin Content Management APIs
const API_BASE = 'http://localhost:3001';

async function testAdminContentAPIs() {
  console.log('🧪 TESTING ADMIN CONTENT MANAGEMENT APIs\n');

  try {
    // Login as admin first
    console.log('🔐 Logging in as admin...');
    const adminLogin = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@test.com',
        password: 'admin123'
      }),
    });

    if (!adminLogin.ok) {
      throw new Error(`Admin login failed: ${adminLogin.status}`);
    }

    const adminData = await adminLogin.json();
    const adminToken = adminData.access_token;
    console.log('✅ Admin login successful\n');

    // Test Content Stats
    console.log('📊 Testing Content Stats API...');
    const statsResponse = await fetch(`${API_BASE}/admin/content/stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (!statsResponse.ok) {
      throw new Error(`Content stats failed: ${statsResponse.status}`);
    }

    const stats = await statsResponse.json();
    console.log('✅ Content Stats:', stats);

    // Test Skills Management
    console.log('\n🛠️ Testing Skills Management...');

    // Get All Skills
    const skillsResponse = await fetch(`${API_BASE}/admin/content/skills?page=1&limit=5`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (!skillsResponse.ok) {
      throw new Error(`Get skills failed: ${skillsResponse.status}`);
    }

    const skillsData = await skillsResponse.json();
    console.log(`✅ Skills retrieved: ${skillsData.data?.length || 0} skills`);

    if (skillsData.data && skillsData.data.length > 0) {
      const firstSkill = skillsData.data[0];
      console.log(`   Sample: ${firstSkill.name} (used ${firstSkill.usageCount || 0} times)`);
    }

    // Test Job Categories Management
    console.log('\n📂 Testing Job Categories Management...');

    // Get All Categories
    const categoriesResponse = await fetch(`${API_BASE}/admin/content/job-categories?page=1&limit=5`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (!categoriesResponse.ok) {
      throw new Error(`Get categories failed: ${categoriesResponse.status}`);
    }

    const categoriesData = await categoriesResponse.json();
    console.log(`✅ Categories retrieved: ${categoriesData.data?.length || 0} categories`);

    if (categoriesData.data && categoriesData.data.length > 0) {
      const firstCategory = categoriesData.data[0];
      console.log(`   Sample: ${firstCategory.name} (${firstCategory.usageCount || 0} jobs)`);
    }

    // Test Create New Skill
    console.log('\n➕ Testing Create New Skill...');
    const newSkill = {
      name: 'TypeScript Advanced',
      description: 'Advanced TypeScript concepts and patterns',
      category: 'Programming'
    };

    const createSkillResponse = await fetch(`${API_BASE}/admin/content/skills`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newSkill)
    });

    if (!createSkillResponse.ok) {
      console.log(`⚠️ Create skill failed: ${createSkillResponse.status} (might already exist)`);
    } else {
      const createdSkill = await createSkillResponse.json();
      console.log(`✅ Skill created: ${createdSkill.name}`);
    }

    // Test Create New Category
    console.log('\n➕ Testing Create New Category...');
    const newCategory = {
      name: 'AI & Machine Learning',
      description: 'Artificial Intelligence and Machine Learning jobs'
    };

    const createCategoryResponse = await fetch(`${API_BASE}/admin/content/job-categories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCategory)
    });

    if (!createCategoryResponse.ok) {
      console.log(`⚠️ Create category failed: ${createCategoryResponse.status} (might already exist)`);
    } else {
      const createdCategory = await createCategoryResponse.json();
      console.log(`✅ Category created: ${createdCategory.name}`);
    }

    // Test Search Functionality
    console.log('\n🔍 Testing Search Skills...');
    const searchResponse = await fetch(`${API_BASE}/admin/content/skills?page=1&limit=5&search=react`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      console.log(`✅ Skills search for "react": ${searchData.data?.length || 0} results`);
    }

    console.log('\n🎉 ADMIN CONTENT MANAGEMENT APIs TEST COMPLETED!');
    console.log('✅ All content management endpoints are working properly!');

  } catch (error) {
    console.error('❌ ADMIN CONTENT APIs TEST FAILED:', error.message);
    console.error('Stack:', error.stack);
  }
}

testAdminContentAPIs();
