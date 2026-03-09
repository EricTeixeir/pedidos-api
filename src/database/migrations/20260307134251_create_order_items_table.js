/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('order_items', (table) => {
        table.increments('id').primary()

        table
            .integer('order_id')
            .unsigned()
            .references('id')
            .inTable('orders')
            .onDelete('CASCADE')

        table.integer('product_id')

        table.integer('quantity')

        table.decimal('price', 10, 2)
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('order_items')
};
