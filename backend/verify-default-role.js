const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const email = "default_role_test@test.com";
  const password = "Password123!";
  const name = "Default Role Test";

  console.log("Testing default role assignment...");

  // Cleanup
  await prisma.user.deleteMany({ where: { email } });

  // Signup via API (simulated by creating user directly as controller does, 
  // but wait, controller uses prisma.create without role, so let's test that exact behavior)
  // Actually, better to test the API endpoint if possible, but I don't want to depend on running server if I can avoid it for this unit test.
  // However, the controller logic is:
  // const newUser = await prisma.user.create({ data: { email, password: hashedPassword, name } });
  // So testing prisma.user.create without role is sufficient to verify the DB default.

  const user = await prisma.user.create({
    data: {
      email,
      password: "hashed_password_placeholder", 
      name,
    },
  });

  console.log(`User created: ${user.email}, Role: ${user.role}`);

  if (user.role === "EMPLOYEE") {
    console.log("[PASS] Default role is EMPLOYEE");
  } else {
    console.error(`[FAIL] Default role is ${user.role}, expected EMPLOYEE`);
    process.exit(1);
  }

  // Cleanup
  await prisma.user.deleteMany({ where: { email } });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
