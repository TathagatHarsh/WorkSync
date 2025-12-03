const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding attendance...');

  const users = await prisma.user.findMany();
  const statuses = ['PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'LEAVE']; // Weighted towards PRESENT

  for (const user of users) {
    console.log(`Seeding attendance for user: ${user.name}`);
    const today = new Date();
    
    // Generate attendance for the past 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0); // Normalize time

      // Skip weekends (optional, but realistic)
      const day = date.getDay();
      if (day === 0 || day === 6) continue;

      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      await prisma.attendance.upsert({
        where: {
          userId_date: {
            userId: user.id,
            date: date,
          },
        },
        update: {}, // Don't update if exists
        create: {
          date: date,
          status: randomStatus,
          userId: user.id,
        },
      });
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
