import { orderRepository } from "../repositories/orderRepository.js";
import { orderMapper } from "../mappers/orderMapper.js";

export const orderService = {
    create: async (body, userId) => {
        const mappedOrder = orderMapper.toDatabase(body);

        const existing = await orderRepository.findByOrderId(mappedOrder.orderId);

        if (existing) {
            const error = new Error(`Pedido ${mappedOrder.orderId} já existe. Verifique o número do pedido e tente novamente.`);
            error.statusCode = 409;
            throw error;
        }

        const result = await orderRepository.create({ ...mappedOrder, userId });

        return orderMapper.toResponse(result);
    },

    findByOrderId: async (orderId) => {
        const result = await orderRepository.findByOrderId(orderId);
        if (!result) {
            const error = new Error(`Pedido '${orderId}' não encontrado.`);
            error.statusCode = 404;
            throw error;
        }
        return orderMapper.toResponse(result);
    },

    findAll: async (userId) => {
        const results = await orderRepository.findAll(userId);
        return results.map((result) => orderMapper.toResponse(result));
    },

    update: async (orderId, body) => {
        const mappedOrder = orderMapper.toDatabase(body);
        const result = await orderRepository.update(orderId, mappedOrder);
        if (!result) {
            const error = new Error(`Pedido '${orderId}' não encontrado.`);
            error.statusCode = 404;
            throw error;
        }
        return orderMapper.toResponse(result);
    },

    delete: async (orderId) => {
        const deleted = await orderRepository.delete(orderId);
        if (!deleted) {
            const error = new Error(`Pedido '${orderId}' não encontrado.`);
            error.statusCode = 404;
            throw error;
        }
    },
};