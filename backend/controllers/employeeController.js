const { prisma } = require("../prisma");
const bcrypt = require("bcrypt");

const getAllEmployees = async (req, res) => {
  try {
    const { role, id } = req.user;

    if (role === "ADMIN") {
      const employees = await prisma.user.findMany({
        where: {
          role: {
            not: "ADMIN",
          },
        },
        select: { id: true, name: true, email: true, role: true },
      });
      return res.json(employees);
    }

    if (role === "HR") {
      const employees = await prisma.user.findMany({
        where: {
          role: {
            notIn: ["ADMIN", "HR"],
          },
        },
        select: { id: true, name: true, email: true, role: true },
      });
      return res.json(employees);
    }

    if (role === "EMPLOYEE") {
      const employee = await prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, role: true },
      });
      return res.json([employee]);
    }

    return res.status(403).json({ message: "Forbidden" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getEmployeeProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const employee = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || "EMPLOYEE",
      },
      select: { id: true, name: true, email: true, role: true },
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, email } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, role, email },
      select: { id: true, name: true, email: true, role: true },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeProfile,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
