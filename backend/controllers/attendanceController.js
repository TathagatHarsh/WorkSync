const { prisma } = require("../prisma");

const getMyAttendance = async (req, res) => {
  try {
    const { id } = req.user;
    const attendance = await prisma.attendance.findMany({
      where: { userId: id },
      orderBy: { date: "desc" },
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    const attendance = await prisma.attendance.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { date: "desc" },
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const requesterRole = req.user.role;

    const attendanceRecord = await prisma.attendance.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });

    if (!attendanceRecord) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // HR cannot update attendance for other HRs or Admins
    if (requesterRole === "HR" && (attendanceRecord.user.role === "HR" || attendanceRecord.user.role === "ADMIN")) {
      return res.status(403).json({ message: "HR cannot modify attendance for other HRs or Admins" });
    }

    const updatedAttendance = await prisma.attendance.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json(updatedAttendance);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { userId, date, status } = req.body;
    const requesterRole = req.user.role;

    const targetUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // HR cannot mark attendance for other HRs or Admins
    if (requesterRole === "HR" && (targetUser.role === "HR" || targetUser.role === "ADMIN")) {
      return res.status(403).json({ message: "HR cannot mark attendance for other HRs or Admins" });
    }

    const newAttendance = await prisma.attendance.upsert({
      where: {
        userId_date: {
          userId: parseInt(userId),
          date: new Date(date),
        },
      },
      update: { status },
      create: {
        userId: parseInt(userId),
        date: new Date(date),
        status,
      },
    });

    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const { startAttendanceCron } = require("../cron/attendanceCron");

const runDailyAttendance = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true },
    });

    const now = new Date();
    // Use UTC midnight to match manual marking
    const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

    let count = 0;
    for (const user of users) {
      const record = await prisma.attendance.upsert({
        where: {
          userId_date: {
            userId: user.id,
            date: today,
          },
        },
        update: {}, // Do nothing if exists
        create: {
          userId: user.id,
          date: today,
          status: "ABSENT",
        },
      });
      if (record) count++;
    }

    res.json({ message: `Daily attendance check completed. Processed ${count} users.` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTodayAttendance = async (req, res) => {
  try {
    const { id } = req.user;
    let today;

    console.log("--- getTodayAttendance Debug ---");
    console.log("User ID:", id);
    console.log("Query Date:", req.query.date);

    if (req.query.date) {
      // If date is provided (YYYY-MM-DD), new Date(date) creates UTC midnight
      today = new Date(req.query.date);
    } else {
      // Fallback to current UTC midnight
      const now = new Date();
      today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    }

    console.log("Parsed Date (UTC):", today.toISOString());

    const attendance = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId: id,
          date: today,
        },
      },
    });

    console.log("Found Attendance:", attendance);
    console.log("--------------------------------");

    res.json(attendance || { status: "Not Marked" });
  } catch (error) {
    console.error("Error in getTodayAttendance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getMyAttendance,
  getAllAttendance,
  updateAttendance,
  markAttendance,
  runDailyAttendance,
  getTodayAttendance,
};
