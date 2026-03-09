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
};