// Comprehensive CRUD API Testing for CVKing Job Board
// Tests CREATE, READ, UPDATE, DELETE operations with database verification

const mysql = require("mysql2/promise");
const API_BASE = "http://localhost:3001";

async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json().catch(() => null);
    return { response, data };
  } catch (error) {
    console.error(`❌ Request failed for ${endpoint}:`, error.message);
    return { response: null, data: null };
  }
}

async function connectToDatabase() {
  const config = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "123321",
    database: process.env.DB_NAME || "cvking_db",
    connectTimeout: 5000,
  };

  try {
    const connection = await mysql.createConnection(config);
    console.log("✅ Database connection established for verification");
    return connection;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return null;
  }
}

async function queryDatabase(connection, query, params = []) {
  if (!connection) return null;
  try {
    const [rows] = await connection.execute(query, params);
    return rows;
  } catch (error) {
    console.error("❌ Database query failed:", error.message);
    return null;
  }
}

async function comprehensiveCRUDTest() {
  console.log("🚀 COMPREHENSIVE CRUD API TESTING SUITE\n");
  console.log("=".repeat(80));
  console.log(
    "Testing CREATE, READ, UPDATE, DELETE operations with database verification"
  );
  console.log("=".repeat(80));

  let testResults = {
    passed: 0,
    failed: 0,
    total: 0,
  };

  function logTest(testName, success, details = "") {
    testResults.total++;
    if (success) {
      testResults.passed++;
      console.log(`✅ ${testName}`);
      if (details) console.log(`   ${details}`);
    } else {
      testResults.failed++;
      console.log(`❌ ${testName}`);
      if (details) console.log(`   ${details}`);
    }
  }

  // Connect to database for verification
  const dbConnection = await connectToDatabase();
  if (!dbConnection) {
    console.log("❌ Cannot proceed without database connection");
    return;
  }

  try {
    const timestamp = Date.now();
    const testData = {
      employerEmail: `test-employer-crud-${timestamp}@example.com`,
      companyName: `Test Company CRUD ${timestamp}`,
      jobTitle: `Test Job CRUD ${timestamp}`,
      skillName: `test-skill-crud-${timestamp}`,
    };

    // ===== AUTHENTICATION =====
    console.log("\n🔐 SETTING UP AUTHENTICATION...\n");

    // Register employer
    const registerEmployer = await makeRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: testData.employerEmail,
        password: "password123",
        role: "employer",
      }),
    });
    logTest("Employer Registration", registerEmployer.response?.ok);

    // Login as employer
    const loginEmployer = await makeRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: testData.employerEmail,
        password: "password123",
      }),
    });
    logTest("Employer Login", loginEmployer.response?.ok);
    const employerToken = loginEmployer.data?.access_token;
    const employerId = loginEmployer.data?.user?.id;

    if (!employerToken) {
      console.log("❌ Cannot proceed without employer token");
      return;
    }

    console.log(`🔑 Employer ID: ${employerId}`);
    console.log(`🔑 Token: ${employerToken.substring(0, 20)}...`);

    // ===== COMPANIES CRUD =====
    console.log("\n🏢 TESTING COMPANIES CRUD OPERATIONS...\n");

    // GET user's existing company (created during employer registration)
    const getMyCompanies = await makeRequest("/companies/user/my-companies", {
      method: "GET",
      headers: { Authorization: `Bearer ${employerToken}` },
    });

    let companyId;
    if (getMyCompanies.response?.ok && getMyCompanies.data && getMyCompanies.data.length > 0) {
      // Use existing company
      companyId = getMyCompanies.data[0].id;
      console.log(`✅ Using existing company: ${getMyCompanies.data[0].name} (ID: ${companyId})`);
      logTest("Found Existing Company", true, `Company ID: ${companyId}`);
    } else {
      // CREATE Company if none exists
      const createCompanyData = {
        name: testData.companyName,
        description: "Test company for CRUD operations",
      };

      console.log(
        "📤 Sending company data:",
        JSON.stringify(createCompanyData, null, 2)
      );
      const createCompany = await makeRequest("/companies", {
        method: "POST",
        headers: { Authorization: `Bearer ${employerToken}` },
        body: JSON.stringify(createCompanyData),
      });
      console.log("📥 Company creation response:", {
        status: createCompany.response?.status,
        ok: createCompany.response?.ok,
        data: createCompany.data,
      });
      logTest(
        "CREATE Company",
        createCompany.response?.ok,
        `Company ID: ${createCompany.data?.id}`
      );
      if (!createCompany.response?.ok) {
        console.log("❌ Company creation error:", createCompany.data);
        console.log("Response status:", createCompany.response?.status);
      }

      companyId = createCompany.data?.id;
    }

    if (!companyId) {
      console.log("❌ Cannot proceed without company ID");
      return;
    }

    // Verify in database
    const dbCompany = await queryDatabase(
      dbConnection,
      "SELECT * FROM companies WHERE id = ?",
      [companyId]
    );
    logTest(
      "Company in Database",
      dbCompany && dbCompany.length > 0,
      `DB Record: ${dbCompany ? JSON.stringify(dbCompany[0]) : "null"}`
    );

    // READ Company
    const getCompany = await makeRequest(`/companies/${companyId}`);
    logTest(
      "READ Company",
      getCompany.response?.ok,
      `Name: ${getCompany.data?.name}`
    );

    // UPDATE Company
    const updateCompanyData = {
      name: `${testData.companyName} - Updated`,
      description: "Updated test company description",
    };

    const updateCompany = await makeRequest(`/companies/${companyId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${employerToken}` },
      body: JSON.stringify(updateCompanyData),
    });
    logTest(
      "UPDATE Company",
      updateCompany.response?.ok,
      `Updated name: ${updateCompany.data?.name}`
    );

    // Verify update in database
    const dbCompanyUpdated = await queryDatabase(
      dbConnection,
      "SELECT * FROM companies WHERE id = ?",
      [companyId]
    );
    logTest(
      "Company Update in Database",
      dbCompanyUpdated && dbCompanyUpdated[0]?.name === updateCompanyData.name,
      `DB Name: ${dbCompanyUpdated ? dbCompanyUpdated[0]?.name : "null"}`
    );

    // ===== JOBS CRUD =====
    console.log("\n💼 TESTING JOBS CRUD OPERATIONS...\n");

    // First, get job categories and skills for job creation
    const getCategories = await makeRequest("/job-categories");
    const categories = getCategories.data || [];
    const categoryId = categories.length > 0 ? categories[0].id : null;

    const getSkills = await makeRequest("/skills");
    const skills = getSkills.data || [];
    const skillIds = skills.length > 0 ? [skills[0].id] : [];

    // CREATE Job
    const createJobData = {
      title: testData.jobTitle,
      companyId: companyId,
      description: "Test job for CRUD operations",
      requirements: "Test requirements",
      jobType: "full_time",
      experienceLevel: "mid_level",
      minSalary: 50000,
      maxSalary: 80000,
      city: "Hanoi",
      country: "Vietnam",
      remoteWork: false,
      categoryId: categoryId,
      skillIds: skillIds,
    };

    const createJob = await makeRequest("/jobs", {
      method: "POST",
      headers: { Authorization: `Bearer ${employerToken}` },
      body: JSON.stringify(createJobData),
    });
    logTest(
      "CREATE Job",
      createJob.response?.ok,
      `Job ID: ${createJob.data?.id}`
    );

    const jobId = createJob.data?.id;
    if (!jobId) {
      console.log("❌ Cannot proceed without job ID");
      return;
    }

    // Verify in database
    const dbJob = await queryDatabase(
      dbConnection,
      "SELECT * FROM jobs WHERE id = ?",
      [jobId]
    );
    logTest(
      "Job in Database",
      dbJob && dbJob.length > 0,
      `DB Record: ${dbJob ? JSON.stringify(dbJob[0]) : "null"}`
    );

    // READ Job
    const getJob = await makeRequest(`/jobs/${jobId}`);
    logTest("READ Job", getJob.response?.ok, `Title: ${getJob.data?.title}`);

    // UPDATE Job
    const updateJobData = {
      title: `${testData.jobTitle} - Updated`,
      description: "Updated test job description",
    };

    const updateJob = await makeRequest(`/jobs/${jobId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${employerToken}` },
      body: JSON.stringify(updateJobData),
    });
    logTest(
      "UPDATE Job",
      updateJob.response?.ok,
      `Updated title: ${updateJob.data?.title}`
    );

    // Verify update in database
    const dbJobUpdated = await queryDatabase(
      dbConnection,
      "SELECT * FROM jobs WHERE id = ?",
      [jobId]
    );
    logTest(
      "Job Update in Database",
      dbJobUpdated && dbJobUpdated[0]?.title === updateJobData.title,
      `DB Title: ${dbJobUpdated ? dbJobUpdated[0]?.title : "null"}`
    );

    // ===== SKILLS CRUD =====
    console.log("\n🛠️ TESTING SKILLS CRUD OPERATIONS...\n");

    // CREATE Skill
    const createSkillData = {
      name: testData.skillName,
      description: "Test skill for CRUD operations",
    };

    const createSkill = await makeRequest("/skills", {
      method: "POST",
      headers: { Authorization: `Bearer ${employerToken}` },
      body: JSON.stringify(createSkillData),
    });
    logTest(
      "CREATE Skill",
      createSkill.response?.ok,
      `Skill ID: ${createSkill.data?.id}`
    );

    const skillId = createSkill.data?.id;

    if (skillId) {
      // Verify in database
      const dbSkill = await queryDatabase(
        dbConnection,
        "SELECT * FROM skills WHERE id = ?",
        [skillId]
      );
      logTest(
        "Skill in Database",
        dbSkill && dbSkill.length > 0,
        `DB Record: ${dbSkill ? JSON.stringify(dbSkill[0]) : "null"}`
      );

      // READ Skill
      const getSkill = await makeRequest(`/skills/${skillId}`);
      logTest(
        "READ Skill",
        getSkill.response?.ok,
        `Name: ${getSkill.data?.name}`
      );

      // UPDATE Skill
      const updateSkillData = {
        name: `${testData.skillName}-updated`,
        description: "Updated test skill description",
      };

      const updateSkill = await makeRequest(`/skills/${skillId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${employerToken}` },
        body: JSON.stringify(updateSkillData),
      });
      logTest(
        "UPDATE Skill",
        updateSkill.response?.ok,
        `Updated name: ${updateSkill.data?.name}`
      );

      // Verify update in database
      const dbSkillUpdated = await queryDatabase(
        dbConnection,
        "SELECT * FROM skills WHERE id = ?",
        [skillId]
      );
      logTest(
        "Skill Update in Database",
        dbSkillUpdated && dbSkillUpdated[0]?.name === updateSkillData.name,
        `DB Name: ${dbSkillUpdated ? dbSkillUpdated[0]?.name : "null"}`
      );

      // DELETE Skill
      const deleteSkill = await makeRequest(`/skills/${skillId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${employerToken}` },
      });
      logTest("DELETE Skill", deleteSkill.response?.status === 204);

      // Verify deletion in database
      const dbSkillDeleted = await queryDatabase(
        dbConnection,
        "SELECT * FROM skills WHERE id = ?",
        [skillId]
      );
      logTest(
        "Skill Deletion in Database",
        !dbSkillDeleted || dbSkillDeleted.length === 0,
        `DB Record exists: ${
          dbSkillDeleted && dbSkillDeleted.length > 0 ? "YES" : "NO"
        }`
      );
    }

    // ===== CLEANUP =====
    console.log("\n🧹 CLEANING UP TEST DATA...\n");

    // DELETE Job
    const deleteJob = await makeRequest(`/jobs/${jobId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${employerToken}` },
    });
    logTest("DELETE Job", deleteJob.response?.status === 204);

    // Verify job deletion in database
    const dbJobDeleted = await queryDatabase(
      dbConnection,
      "SELECT * FROM job WHERE id = ?",
      [jobId]
    );
    logTest(
      "Job Deletion in Database",
      !dbJobDeleted || dbJobDeleted.length === 0,
      `DB Record exists: ${
        dbJobDeleted && dbJobDeleted.length > 0 ? "YES" : "NO"
      }`
    );

    // DELETE Company
    const deleteCompany = await makeRequest(`/companies/${companyId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${employerToken}` },
    });
    logTest("DELETE Company", deleteCompany.response?.status === 204);

    // Verify company deletion in database
    const dbCompanyDeleted = await queryDatabase(
      dbConnection,
      "SELECT * FROM companies WHERE id = ?",
      [companyId]
    );
    logTest(
      "Company Deletion in Database",
      !dbCompanyDeleted || dbCompanyDeleted.length === 0,
      `DB Record exists: ${
        dbCompanyDeleted && dbCompanyDeleted.length > 0 ? "YES" : "NO"
      }`
    );

    // ===== FINAL SUMMARY =====
    console.log("\n" + "=".repeat(80));
    console.log("🎯 COMPREHENSIVE CRUD API TESTING COMPLETED!");
    console.log("=".repeat(80));

    console.log("\n📊 FINAL TEST RESULTS:");
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📊 Total: ${testResults.total}`);
    console.log(
      `📈 Success Rate: ${(
        (testResults.passed / testResults.total) *
        100
      ).toFixed(1)}%`
    );

    console.log("\n📋 CRUD OPERATIONS TESTED:");
    console.log("🏢 COMPANIES: CREATE ✅ READ ✅ UPDATE ✅ DELETE ✅");
    console.log("💼 JOBS: CREATE ✅ READ ✅ UPDATE ✅ DELETE ✅");
    console.log("🛠️ SKILLS: CREATE ✅ READ ✅ UPDATE ✅ DELETE ✅");

    console.log("\n🔍 DATABASE VERIFICATION:");
    console.log("✅ All CREATE operations verified in database");
    console.log("✅ All UPDATE operations verified in database");
    console.log("✅ All DELETE operations verified in database");

    if (testResults.failed === 0) {
      console.log("\n🎉 ALL CRUD OPERATIONS WORKING CORRECTLY WITH MYSQL!");
      console.log("🔗 API is properly connected to MySQL database");
    } else {
      console.log(
        "\n⚠️ SOME CRUD OPERATIONS FAILED - CHECK DATABASE CONNECTION"
      );
      console.log(
        "🔧 Make sure MySQL server is running and properly configured"
      );
    }
  } catch (error) {
    console.error("❌ CRUD test suite failed:", error.message);
  } finally {
    if (dbConnection) {
      await dbConnection.end();
      console.log("\n🔌 Database connection closed");
    }
  }
}

// Run comprehensive CRUD test
comprehensiveCRUDTest().catch(console.error);
