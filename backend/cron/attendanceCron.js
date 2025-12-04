const cron = require("node-cron");
const { prisma } = require("../prisma");

const startAttendanceCron = () => {
  // Run every day at 00:00 (midnight)
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily attendance cron job...");
    try {
      const users = await prisma.user.findMany({
        select: { id: true },
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const user of users) {
        await prisma.attendance.upsert({
          where: {
            userId_date: {
              userId: user.id,
              date: today,
            },
          },
          update: {}, // Do nothing if already exists
          create: {
            userId: user.id,
            date: today,
            status: "ABSENT",
          },
        });
      }
      console.log(`Marked ${users.length} users as ABSENT for ${today.toISOString()}`);
    } catch (error) {
      console.error("Error in attendance cron job:", error);
    }
  });
};

module.exports = { startAttendanceCron };
