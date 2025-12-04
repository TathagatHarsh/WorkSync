const BASE_URL = "http://localhost:3000";

async function main() {
  console.log("Testing Mark Attendance API...");

  // 1. Login as Admin
  const loginRes = await fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "tharsh13052006@gmail.com",
      password: "Tathagat13*",
    }),
  });

  if (!loginRes.ok) {
    console.error("Admin login failed");
    process.exit(1);
  }

  const { token } = await loginRes.json();
  console.log("[PASS] Admin logged in.");

  // 2. Get User ID for employee1@gmail.com
  // We need to fetch the employee list to find the ID
  const employeesRes = await fetch(`${BASE_URL}/api/employees`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const employees = await employeesRes.json();
  const targetUser = employees.find((e) => e.email === "employee1@gmail.com");

  if (!targetUser) {
    console.error("Target user employee1@gmail.com not found!");
    process.exit(1);
  }
  console.log(`Target User ID: ${targetUser.id}`);

  // 3. Mark Attendance
  const date = new Date().toISOString().split("T")[0];
  console.log(`Marking attendance for ${date}...`);

  const markRes = await fetch(`${BASE_URL}/api/attendance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId: targetUser.id,
      date: date,
      status: "PRESENT",
    }),
  });

  if (markRes.ok) {
    console.log("[PASS] Attendance marked successfully.");
    const data = await markRes.json();
    console.log(data);
  } else {
    console.error(`[FAIL] Failed to mark attendance: ${markRes.status}`);
    const text = await markRes.text();
    console.error(text);
  }
}

main().catch(console.error);
