import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/database";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "resepkita-secret-key";

router.post("/login", async (req, res) => {
  const email = String(req.body?.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(req.body?.password ?? "");

  if (!email || !password) {
    return res.status(400).json({
      message: "Email dan password wajib diisi",
    });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT id, name, email, password FROM users WHERE email = ?",
      [email],
    );

    const users = Array.isArray(rows) ? rows : [];

    if (users.length === 0) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    const user = users[0] as {
      id: number;
      name: string;
      email: string;
      password: string;
    };

    const storedPassword = String(user.password ?? "");
    const isLegacyPlainTextPassword =
      storedPassword.length > 0 &&
      !storedPassword.startsWith("$2") &&
      storedPassword === password;
    const isPasswordValid = storedPassword.startsWith("$2")
      ? await bcrypt.compare(password, storedPassword)
      : storedPassword === password;

    if (!isPasswordValid && isLegacyPlainTextPassword) {
      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.execute("UPDATE users SET password = ? WHERE id = ?", [
        hashedPassword,
        user.id,
      ]);
    }

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan server saat login",
    });
  }
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Nama, email, dan password wajib diisi",
    });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedName = String(name).trim();

    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [normalizedEmail],
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return res.status(409).json({
        message: "Email sudah terdaftar",
      });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [normalizedName, normalizedEmail, hashedPassword],
    );

    const insertResult = result as { insertId?: number };

    return res.status(201).json({
      message: "Registrasi berhasil",
      user: {
        id: insertResult.insertId ?? 0,
        name: normalizedName,
        email: normalizedEmail,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan server saat registrasi",
    });
  }
});

export default router;
