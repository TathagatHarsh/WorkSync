const cors = require("cors");
const bcrypt = require("bcrypt");
const express = require("express");
const { prisma } = require("./prisma");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const privatekey = process.env.JWT_SECRET;

app.post("/signup", async function (req, res) {
  const schema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/,
        "Password must include upper, lower, and special character"
      ),
    name: z.string().min(3).max(30),
  });

  // Log incoming request for debugging
  console.log("Signup request body:", req.body);

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    console.log("Validation errors:", parsed.error.issues);
    const errorMessages = parsed.error.issues.map((err) => {
      if (err.path[0] === "password") {
        if (err.code === "too_small") {
          return "Password must be at least 8 characters long";
        }
        if (err.code === "invalid_string") {
          return "Password must include uppercase, lowercase, and special character";
        }
      }
      if (err.path[0] === "name") {
        if (err.code === "too_small") {
          return "Name must be at least 3 characters long";
        }
        if (err.code === "too_big") {
          return "Name must be less than 30 characters";
        }
      }
      if (err.path[0] === "email") {
        return "Please enter a valid email address";
      }
      return err.message;
    });

    return res.status(400).json({
      message: errorMessages.join(". "),
      error: parsed.error.issues,
    });
  }

  const { email, password, name } = parsed.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    const token = jwt.sign({ id: newUser.id }, privatekey, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "Signup successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/signin", async function (req, res) {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, privatekey, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
