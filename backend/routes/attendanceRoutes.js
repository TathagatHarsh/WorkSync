const express = require("express");
const {
  getMyAttendance,
  getAllAttendance,
  updateAttendance,
  markAttendance,
  runDailyAttendance,
  getTodayAttendance,
} = require("../controllers/attendanceController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", authenticate, getMyAttendance);
router.get("/today", authenticate, getTodayAttendance);
router.get("/", authenticate, authorizeRoles("ADMIN", "HR"), getAllAttendance);
router.post("/", authenticate, authorizeRoles("ADMIN", "HR"), markAttendance);
router.post("/run-daily", authenticate, authorizeRoles("ADMIN", "HR"), runDailyAttendance);
router.put("/:id", authenticate, authorizeRoles("ADMIN", "HR"), updateAttendance);

module.exports = router;
