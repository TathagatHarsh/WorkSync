const express = require("express");
const {
  createNotice,
  getAllNotices,
  deleteNotice,
} = require("../controllers/noticeController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Public Read Access (Authenticated)
router.get("/", authenticate, getAllNotices);

// Restricted Write/Delete Access (Admin/HR)
router.post("/", authenticate, authorizeRoles("ADMIN", "HR"), createNotice);
router.delete("/:id", authenticate, authorizeRoles("ADMIN", "HR"), deleteNotice);

module.exports = router;
