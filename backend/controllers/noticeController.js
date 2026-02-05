const { prisma } = require("../prisma");

const createNotice = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const { id } = req.user;

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        category,
        postedBy: id,
      },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllNotices = async (req, res) => {
  try {
    const notices = await prisma.notice.findMany({
      include: {
        author: {
          select: { name: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.notice.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createNotice,
  getAllNotices,
  deleteNotice,
};
