const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
const BASE_URL = "http://localhost:3000";

async function main() {
  console.log("Verifying Get Attendance...");

  const email = "employee1@gmail.com";
  const password = "Password123!";

  // 1. Reset Password
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });
  console.log("Password reset for testing.");

  // 2. Login as Employee
  const loginRes = await fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!loginRes.ok) {
    console.error("Login failed");
    process.exit(1);
  }

  const { token } = await loginRes.json();
  console.log("Logged in as employee.");

  // 3. Get Attendance
  const attendanceRes = await fetch(`${BASE_URL}/api/attendance/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const attendance = await attendanceRes.json();
  console.log("Attendance Records fetched:");
  console.log(attendance);

  if (attendance.length > 0) {
    console.log("[PASS] Records found.");
  } else {
    console.error("[FAIL] No records found.");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
