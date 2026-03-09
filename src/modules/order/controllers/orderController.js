import { orderService } from "../services/orderService.js";

export const orderController = {
    create: async (req, res, next) => {
        try {
            const order = await orderService.create(req.body, req.user.id);
            res.status(201).json(order);
        } catch (error) {
            if (error.statusCode === 409) {
                return res.status(409).json({ message: error.message });
            }
            next(error);
        }
    },
};