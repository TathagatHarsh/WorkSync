const cors = require("cors");
const express = require("express");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const taskRoutes = require("./routes/taskRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const payrollRoutes = require("./routes/payrollRoutes");

const { startAttendanceCron } = require("./cron/attendanceCron");

const app = express();
app.use(express.json());
app.use(cors());

// Start Cron Jobs
startAttendanceCron();

app.use("/", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/payroll", payrollRoutes);

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
