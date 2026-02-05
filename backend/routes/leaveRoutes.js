const express = require("express");
const {
  createLeaveRequest,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Employee Routes
router.post("/", authenticate, createLeaveRequest);
router.get("/my", authenticate, getMyLeaves);

// Admin/HR Routes
router.get("/", authenticate, authorizeRoles("ADMIN", "HR"), getAllLeaves);
router.put("/:id/status", authenticate, authorizeRoles("ADMIN", "HR"), updateLeaveStatus);

module.exports = router;
