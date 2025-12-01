const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const BASE_URL = "http://localhost:3000";

async function main() {
  console.log("Testing Signup -> Get Profile flow...");

  const email = "signup_test_v2@test.com";
  const password = "Password123!";
  const name = "Signup Test";

  // Cleanup
  await prisma.user.deleteMany({ where: { email } });

  // 1. Signup
  console.log("1. Signing up...");
  const signupRes = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });

  if (!signupRes.ok) {
    console.error(`Signup failed: ${signupRes.status} ${signupRes.statusText}`);
    const text = await signupRes.text();
    console.error(text);
    process.exit(1);
  }

  const signupData = await signupRes.json();
  const token = signupData.token;
  console.log("Signup successful, token received.");

  // 2. Fetch Profile
  console.log("2. Fetching profile...");
  const profileRes = await fetch(`${BASE_URL}/api/employees/me`, {
    method: "GET",
    headers: { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });

  if (!profileRes.ok) {
    console.error(`Fetch profile failed: ${profileRes.status} ${profileRes.statusText}`);
    const text = await profileRes.text();
    console.error(text);
    process.exit(1);
  }

  const profileData = await profileRes.json();
  console.log("Profile fetched successfully:", profileData);

  if (profileData.email === email && profileData.role === "EMPLOYEE") {
    console.log("[PASS] Flow verified.");
  } else {
    console.error("[FAIL] Profile data mismatch.");
  }

  // Cleanup
  await prisma.user.deleteMany({ where: { email } });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
