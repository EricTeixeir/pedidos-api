import { Router } from "express";
import orderRoutes from "../modules/order/routes/orderRoutes.js";
import authRoutes from "../modules/auth/routes/authRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/order", orderRoutes);

export default router;