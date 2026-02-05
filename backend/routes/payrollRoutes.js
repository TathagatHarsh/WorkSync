const express = require("express");
const {
  setSalary,
  getSalary,
  generatePayslip,
  getMyPayroll,
} = require("../controllers/payrollController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Employee (My Payroll)
router.get("/my", authenticate, getMyPayroll);

// Admin/HR (Manage Payroll)
router.post("/salary", authenticate, authorizeRoles("ADMIN", "HR"), setSalary);
router.get("/salary/:userId", authenticate, authorizeRoles("ADMIN", "HR"), getSalary);
router.post("/generate", authenticate, authorizeRoles("ADMIN", "HR"), generatePayslip);

module.exports = router;
