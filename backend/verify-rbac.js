const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
const BASE_URL = "http://localhost:3000";

async function main() {
  console.log("Starting verification...");

  // 1. Setup users
  const users = [
    { email: "admin@test.com", password: "Password123!", name: "Admin User", role: "ADMIN" },
    { email: "hr@test.com", password: "Password123!", name: "HR User", role: "HR" },
    { email: "emp1@test.com", password: "Password123!", name: "Employee 1", role: "EMPLOYEE" },
    { email: "emp2@test.com", password: "Password123!", name: "Employee 2", role: "EMPLOYEE" },
  ];

  const tokens = {};

  for (const u of users) {
    // Clean up existing
    await prisma.user.deleteMany({ where: { email: u.email } });

    // Create user
    const hashedPassword = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.create({
      data: {
        email: u.email,
        password: hashedPassword,
        name: u.name,
        role: u.role,
      },
    });
    console.log(`Created ${u.role}: ${u.email}`);

    // Login
    try {
      const res = await fetch(`${BASE_URL}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: u.email, password: u.password }),
      });
      const data = await res.json();
      tokens[u.role] = data.token;
      if (u.role === "EMPLOYEE") {
        if (!tokens["EMPLOYEE_1"]) tokens["EMPLOYEE_1"] = data.token;
        else tokens["EMPLOYEE_2"] = data.token;
      }
    } catch (e) {
      console.error(`Login failed for ${u.email}:`, e.message);
    }
  }

  async function testAccess(roleKey, method, url, expectedStatus, data = {}) {
    try {
      const token = roleKey.startsWith("EMPLOYEE") ? (roleKey === "EMPLOYEE_1" ? tokens["EMPLOYEE_1"] : tokens["EMPLOYEE_2"]) : tokens[roleKey];
      
      const options = {
        method,
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      };
      if (method !== "GET" && method !== "DELETE") {
        options.body = JSON.stringify(data);
      }

      const res = await fetch(`${BASE_URL}${url}`, options);

      if (res.status === expectedStatus) {
        console.log(`[PASS] ${roleKey} ${method} ${url} -> ${res.status}`);
      } else {
        console.log(`[FAIL] ${roleKey} ${method} ${url} -> Got ${res.status}, expected ${expectedStatus}`);
      }
    } catch (error) {
      console.log(`[FAIL] ${roleKey} ${method} ${url} -> Error: ${error.message}`);
    }
  }

  // 2. Test GET /api/employees
  console.log("\nTesting GET /api/employees");
  await testAccess("ADMIN", "GET", "/api/employees", 200);
  await testAccess("HR", "GET", "/api/employees", 200);
  await testAccess("EMPLOYEE_1", "GET", "/api/employees", 200); // Should return only self, but status 200

  // 3. Test POST /api/employees
  console.log("\nTesting POST /api/employees");
  const newEmp = { email: "new@test.com", password: "Password123!", name: "New Emp", role: "EMPLOYEE" };
  await prisma.user.deleteMany({ where: { email: newEmp.email } });
  
  await testAccess("ADMIN", "POST", "/api/employees", 201, newEmp);
  await prisma.user.deleteMany({ where: { email: newEmp.email } }); // Cleanup
  
  await testAccess("HR", "POST", "/api/employees", 201, newEmp);
  await prisma.user.deleteMany({ where: { email: newEmp.email } }); // Cleanup

  await testAccess("EMPLOYEE_1", "POST", "/api/employees", 403, newEmp);

  // 4. Test DELETE /api/employees/:id
  console.log("\nTesting DELETE /api/employees/:id");
  // Create a dummy user to delete
  const deleteEmail = "delete@test.com";
  await prisma.user.deleteMany({ where: { email: deleteEmail } });
  
  const toDelete = await prisma.user.create({
    data: {
      email: deleteEmail,
      password: "hash",
      name: "Delete Me",
      role: "EMPLOYEE",
    },
  });

  await testAccess("EMPLOYEE_1", "DELETE", `/api/employees/${toDelete.id}`, 403);
  await testAccess("HR", "DELETE", `/api/employees/${toDelete.id}`, 403);
  await testAccess("ADMIN", "DELETE", `/api/employees/${toDelete.id}`, 200);

  console.log("\nVerification complete!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
