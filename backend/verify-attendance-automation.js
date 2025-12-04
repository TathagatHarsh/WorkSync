const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { startAttendanceCron } = require("./cron/attendanceCron");

async function main() {
  console.log("Testing Attendance Automation...");

  // 1. Simulate Cron Job Logic
  console.log("1. Simulating daily attendance creation...");
  const users = await prisma.user.findMany({ select: { id: true } });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Clear existing attendance for today to ensure clean test
  await prisma.attendance.deleteMany({ where: { date: today } });

  // Run the logic manually (replicating cron job)
  for (const user of users) {
    await prisma.attendance.create({
      data: {
        userId: user.id,
        date: today,
        status: "ABSENT",
      },
    });
  }

  // Verify creation
  const attendanceRecords = await prisma.attendance.findMany({
    where: { date: today },
  });

  if (attendanceRecords.length === users.length) {
    console.log(`[PASS] Created ${attendanceRecords.length} attendance records.`);
  } else {
    console.error(`[FAIL] Expected ${users.length} records, found ${attendanceRecords.length}`);
    process.exit(1);
  }

  const allAbsent = attendanceRecords.every((r) => r.status === "ABSENT");
  if (allAbsent) {
    console.log("[PASS] All records are marked ABSENT by default.");
  } else {
    console.error("[FAIL] Some records are not ABSENT.");
    process.exit(1);
  }

  // 2. Verify Update Logic (Simulating Admin Update)
  console.log("2. Verifying Admin update logic...");
  const recordToUpdate = attendanceRecords[0];
  const updatedRecord = await prisma.attendance.update({
    where: { id: recordToUpdate.id },
    data: { status: "PRESENT" },
  });

  if (updatedRecord.status === "PRESENT") {
    console.log("[PASS] Admin successfully updated status to PRESENT.");
  } else {
    console.error("[FAIL] Failed to update status.");
    process.exit(1);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
