const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const email = "employee1@gmail.com";
  console.log(`Debugging attendance for: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error("User not found!");
    return;
  }

  console.log(`User ID: ${user.id}`);
  console.log(`Role: ${user.role}`);

  const attendance = await prisma.attendance.findMany({
    where: { userId: user.id },
  });

  console.log(`Found ${attendance.length} attendance records:`);
  console.log(attendance);

  // Check all attendance records to see if there are any at all
  const allAttendance = await prisma.attendance.findMany({
    take: 5,
  });
  console.log("Sample of all attendance records in DB:", allAttendance);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
