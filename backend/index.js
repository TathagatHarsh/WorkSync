const cors = require("cors");
const express = require("express");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const { startAttendanceCron } = require("./cron/attendanceCron");

const app = express();
app.use(express.json());
app.use(cors());

// Start Cron Jobs
startAttendanceCron();

app.use("/", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
