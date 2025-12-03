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

    const newAttendance = await prisma.attendance.create({
      data: {
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

module.exports = {
  getMyAttendance,
  getAllAttendance,
  updateAttendance,
  markAttendance,
};
