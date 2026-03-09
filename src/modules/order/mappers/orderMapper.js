export const orderMapper = {
    toDatabase: (body) => ({
        orderId: body.numeroPedido,
        value: body.valorTotal,
        creationDate: new Date(body.dataCriacao).toISOString(),
        items: body.items.map((item) => ({
            productId: Number(item.idItem),
            quantity: item.quantidadeItem,
            price: item.valorItem,
        })),
    }),

    toResponse: ({ order, items }) => ({
        orderId: order.order_id,
        value: Number(order.total),
        creationDate: order.creation_date,
        items: items.map((item) => ({
            productId: item.product_id,
            quantity: item.quantity,
            price: Number(item.price),
        })),
    }),
};