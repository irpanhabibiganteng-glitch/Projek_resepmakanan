import { Router } from "express";
import jwt from "jsonwebtoken";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "../controllers/postController";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "resepkita-secret-key";

const requireAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token tidak ditemukan atau tidak valid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
    };
    req.user = decoded;
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token tidak valid atau sudah kadaluarsa" });
  }
};

router.get("/", requireAuth, getPosts);
router.get("/:id", requireAuth, getPostById);
router.post("/", requireAuth, createPost);
router.put("/:id", requireAuth, updatePost);
router.delete("/:id", requireAuth, deletePost);

export default router;
