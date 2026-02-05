const { prisma } = require("../prisma");

const createLeaveRequest = async (req, res) => {
  try {
    const { startDate, endDate, reason, type } = req.body;
    const { id } = req.user;

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        type,
        userId: id,
      },
    });

    res.status(201).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyLeaves = async (req, res) => {
  try {
    const { id } = req.user;
    const leaves = await prisma.leaveRequest.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
    });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllLeaves = async (req, res) => {
  try {
    const leaves = await prisma.leaveRequest.findMany({
      include: {
        user: {
          select: { name: true, email: true, department: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // APPROVED or REJECTED

    const leaveRequest = await prisma.leaveRequest.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    // If Approved, update Attendance records
    if (status === "APPROVED") {
      const start = new Date(leaveRequest.startDate);
      const end = new Date(leaveRequest.endDate);
      const userId = leaveRequest.userId;

      const datesToMark = [];
      let currentDate = new Date(start);

      while (currentDate <= end) {
        // Skip weekends if needed, but for now mark all
        datesToMark.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      await Promise.all(
        datesToMark.map((date) =>
          prisma.attendance.upsert({
            where: {
              userId_date: {
                userId,
                date,
              },
            },
            update: { status: "LEAVE" },
            create: {
              userId,
              date,
              status: "LEAVE",
            },
          })
        )
      );
    }

    res.json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createLeaveRequest,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
};
