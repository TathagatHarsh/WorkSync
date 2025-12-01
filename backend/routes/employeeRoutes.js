const express = require("express");
const {
  getAllEmployees,
  getEmployeeProfile,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, getAllEmployees);
router.get("/me", authenticate, getEmployeeProfile);
router.post("/", authenticate, authorizeRoles("ADMIN", "HR"), createEmployee);
router.put("/:id", authenticate, authorizeRoles("ADMIN", "HR"), updateEmployee);
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteEmployee);

module.exports = router;
