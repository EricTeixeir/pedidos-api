import db from "../../database/connection.js";

export const authRepository = {
    findByEmail: async (email) => {
        const user = await db("users")
            .where({ email })
            .whereNull("deleted_at")
            .first();
        return user ?? null;
    },

    create: async (userData) => {
        const [user] = await db("users").insert(userData).returning("*");
        return user;
    },
};