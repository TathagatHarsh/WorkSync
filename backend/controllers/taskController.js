const { prisma } = require("../prisma");

const createTask = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = await prisma.todo.create({
      data: {
        title,
        description,
        date: date ? new Date(date) : new Date(),
        userId,
      },
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date query parameter is required (YYYY-MM-DD)" });
    }

    const searchDate = new Date(date);
    // Set start and end of the day for accurate filtering
    const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

    const tasks = await prisma.todo.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { id: "asc" },
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, done } = req.body;
    const userId = req.user.id;

    const task = await prisma.todo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.userId !== userId) {
      return res.status(403).json({ message: "Forbidden: You do not own this task" });
    }

    const updatedTask = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        done,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await prisma.todo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.userId !== userId) {
      return res.status(403).json({ message: "Forbidden: You do not own this task" });
    }

    await prisma.todo.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
