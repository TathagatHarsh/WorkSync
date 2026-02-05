const { prisma } = require("../prisma");

const setSalary = async (req, res) => {
  try {
    const { userId, basicSalary, allowances, deductions } = req.body;

    const salary = await prisma.salaryStructure.upsert({
      where: { userId },
      update: { basicSalary, allowances, deductions },
      create: { userId, basicSalary, allowances, deductions },
    });

    res.json(salary);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSalary = async (req, res) => {
  try {
    const { userId } = req.params;
    const salary = await prisma.salaryStructure.findUnique({
      where: { userId: parseInt(userId) },
    });
    res.json(salary);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const generatePayslip = async (req, res) => {
  try {
    const { userId, month } = req.body;

    const salaryStructure = await prisma.salaryStructure.findUnique({
      where: { userId },
    });

    if (!salaryStructure) {
      return res.status(404).json({ message: "Salary structure not set for user" });
    }

    const totalPaid =
      salaryStructure.basicSalary +
      salaryStructure.allowances -
      salaryStructure.deductions;

    const payslip = await prisma.payrollRecord.create({
      data: {
        userId,
        month,
        totalPaid,
      },
    });

    res.status(201).json(payslip);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyPayroll = async (req, res) => {
  try {
    const { id } = req.user;
    const records = await prisma.payrollRecord.findMany({
      where: { userId: id },
      orderBy: { month: "desc" },
    });
    const structure = await prisma.salaryStructure.findUnique({
      where: { userId: id },
    });

    res.json({ structure, records });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  setSalary,
  getSalary,
  generatePayslip,
  getMyPayroll,
};
