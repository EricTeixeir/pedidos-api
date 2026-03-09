import { Router } from "express";
import { orderController } from "../controllers/orderController.js";
import { authenticate } from "../../../middlewares/authenticate.js";

const router = Router();

router.post("/", authenticate, orderController.create);
router.get("/list", authenticate, orderController.findAll);
router.get("/:orderId", authenticate, orderController.findByOrderId);
router.put("/:orderId", authenticate, orderController.update);
router.delete("/:orderId", authenticate, orderController.delete);

export default router;