import { orderService } from "../services/orderService.js";

export const orderController = {
    create: async (req, res) => {
        try {
            const order = await orderService.create(req.body, req.user.id);
            res.status(201).json(order);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },
    findByOrderId: async (req, res) => {
        try {
            const order = await orderService.findByOrderId(req.params.orderId);
            res.status(200).json(order);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message }); porderRoutes
        }
    },

    findAll: async (req, res) => {
        try {
            const orders = await orderService.findAll(req.user.id);
            res.status(200).json(orders);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const order = await orderService.update(req.params.orderId, req.body);
            res.status(200).json(order);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            await orderService.delete(req.params.orderId);
            res.status(204).send();
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },
};