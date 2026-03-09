import bcrypt from "bcryptjs";

export async function seed(knex) {
  // Limpa as tabelas na ordem correta (respeitando as FKs)
  await knex("order_items").del();
  await knex("orders").del();
  await knex("users").del();

  // Cria o usuário admin
  const hashedPassword = await bcrypt.hash("123", 10);

  const [user] = await knex("users").insert({
    name: "Admin",
    email: "admin@admin",
    password: hashedPassword,
  }).returning("*");

  // Cria pedidos fictícios
  const [order1] = await knex("orders").insert({
    user_id: user.id,
    order_id: "v10089015vdb-01",
    total: 10000,
    creation_date: new Date("2026-02-19T12:24:11.529Z"),
    status: "pending",
  }).returning("*");

  const [order2] = await knex("orders").insert({
    user_id: user.id,
    order_id: "v10089015vdb-02",
    total: 5000,
    creation_date: new Date("2026-02-10T09:00:00.000Z"),
    status: "completed",
  }).returning("*");

  // Cria items dos pedidos
  await knex("order_items").insert([
    { order_id: order1.id, product_id: 2434, quantity: 2, price: 3000 },
    { order_id: order1.id, product_id: 2435, quantity: 1, price: 4000 },
  ]);

  await knex("order_items").insert([
    { order_id: order2.id, product_id: 2436, quantity: 5, price: 1000 },
  ]);
}