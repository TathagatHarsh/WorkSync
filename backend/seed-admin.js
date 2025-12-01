const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const email = "tharsh13052006@gmail.com";
  const password = "Tathagat13*";
  const name = "Tathagat Harsh"; // Assuming name based on email/context
  const role = "ADMIN";

  console.log(`Seeding admin user: ${email}...`);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: role,
    },
    create: {
      email,
      password: hashedPassword,
      name,
      role,
    },
  });

  console.log(`Admin user seeded: ${user.email} with role ${user.role}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
