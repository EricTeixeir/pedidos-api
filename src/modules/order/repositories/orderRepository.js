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

    findAll: async (userId) => {
        const orders = await db("orders")
            .where({ user_id: userId })
            .whereNull("deleted_at")
            .orderBy("created_at", "desc");

        return Promise.all(
            orders.map(async (order) => {
                const items = await db("order_items").where({ order_id: order.id });
                return { order, items };
            })
        );
    },

    update: async (orderId, { value, creationDate, items }) => {
        return db.transaction(async (trx) => {
            const [order] = await trx("orders")
                .where({ order_id: orderId })
                .update({ total: value, creation_date: creationDate })
                .returning("*");

            if (!order) return null;

            await trx("order_items").where({ order_id: order.id }).del();

            const orderItems = items.map((item) => ({
                order_id: order.id,
                product_id: item.productId,
                quantity: item.quantity,
                price: item.price,
            }));

            const updatedItems = await trx("order_items").insert(orderItems).returning("*");
            return { order, items: updatedItems };
        });
    },

    delete: async (orderId) => {
        const deleted = await db("orders")
            .where({ order_id: orderId })
            .update({ deleted_at: new Date() });
        return deleted > 0;
    },
};