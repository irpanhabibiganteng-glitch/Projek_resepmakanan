import { Router } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../config/database";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "resepkita-secret-key";

const requireAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token tidak ditemukan atau tidak valid",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      name: string;
    };

    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Token tidak valid atau sudah kadaluarsa",
    });
  }
};

router.get("/me", requireAuth, async (req: any, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, email, profile_image AS profileImage FROM users WHERE id = ?",
      [req.user.id],
    );

    const users = Array.isArray(rows) ? rows : [];

    if (users.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const user = users[0] as {
      id: number;
      name: string;
      email: string;
      profileImage?: string | null;
    };

    return res.json({
      message: "Data user berhasil diambil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage ?? null,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan server saat mengambil profil",
    });
  }
});

router.put("/me", requireAuth, async (req: any, res) => {
  const { name, email, profileImage } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Nama dan email wajib diisi",
    });
  }

  try {
    const normalizedName = String(name).trim();
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedProfileImage =
      profileImage !== undefined && profileImage !== null
        ? String(profileImage).trim()
        : undefined;

    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [normalizedEmail, req.user.id],
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return res.status(409).json({
        message: "Email sudah digunakan oleh user lain",
      });
    }

    await pool.execute(
      `UPDATE users
       SET name = ?, email = ?, profile_image = ?
       WHERE id = ?`,
      [
        normalizedName,
        normalizedEmail,
        normalizedProfileImage ?? null,
        req.user.id,
      ],
    );

    const [rows] = await pool.execute(
      "SELECT id, name, email, profile_image AS profileImage FROM users WHERE id = ?",
      [req.user.id],
    );

    const users = Array.isArray(rows) ? rows : [];
    const user = users[0] as {
      id: number;
      name: string;
      email: string;
      profileImage?: string | null;
    };

    return res.json({
      message: "Profil user berhasil diperbarui",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage ?? null,
      },
    });
  } catch (error) {
    console.error("Update current user error:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan server saat memperbarui profil",
    });
  }
});

router.get("/profile", requireAuth, async (req: any, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, email, profile_image AS profileImage FROM users WHERE id = ?",
      [req.user.id],
    );

    const users = Array.isArray(rows) ? rows : [];

    if (users.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    return res.json({
      message: "Profile user berhasil diambil",
      user: users[0],
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan server saat mengambil profile",
    });
  }
});

export default router;
