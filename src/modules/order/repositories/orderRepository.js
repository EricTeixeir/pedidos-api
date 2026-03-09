import db from "../../../database/connection.js";

export const orderRepository = {
    create: async ({ orderId, value, creationDate, items, userId }) => {
        return db.transaction(async (trx) => {
            const [order] = await trx("orders")
                .insert({
                    order_id: orderId,
                    total: value,
                    creation_date: creationDate,
                    user_id: userId,
                    status: "pending",
                })
                .returning("*");

            const orderItems = items.map((item) => ({
                order_id: order.id,
                product_id: item.productId,
                quantity: item.quantity,
                price: item.price,
            }));

            const createdItems = await trx("order_items")
                .insert(orderItems)
                .returning("*");

            return { order, items: createdItems };
        });
    },

    findByOrderId: async (orderId) => {
        const order = await db("orders")
            .where({ order_id: orderId })
            .whereNull("deleted_at")
            .first();

        if (!order) return null;

        const items = await db("order_items")
            .where({ order_id: order.id });

        return { order, items };
    },
};