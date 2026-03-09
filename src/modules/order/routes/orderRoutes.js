import { Router } from "express";
import { orderController } from "../controllers/orderController.js";
import { authenticate } from "../../../middlewares/authenticate.js";

const router = Router();

router.post("/", authenticate, orderController.create);

export default router;