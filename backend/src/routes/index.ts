import { Router } from "express";
import authRoutes from "./authRoutes";
import postRoutes from "./postRoutes";
import userRoutes from "./userRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/users", userRoutes);

export default router;
