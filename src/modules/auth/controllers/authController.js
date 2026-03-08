import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authRepository } from "../repositories/authRepository.js";

export const authService = {
    register: async ({ name, email, password }) => {
        const existing = await authRepository.findByEmail(email);

        if (existing) {
            const error = new Error("Já existe uma conta cadastrada com este e-mail. Por favor, utilize outro e-mail ou faça login.");
            error.statusCode = 409;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await authRepository.create({ name, email, password: hashedPassword });

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },

    login: async ({ email, password }) => {
        const user = await authRepository.findByEmail(email);

        if (!user) {
            const error = new Error("Credenciais inválidas. Verifique seu e-mail e senha e tente novamente.");
            error.statusCode = 401;
            throw error;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            const error = new Error("Credenciais inválidas. Verifique seu e-mail e senha e tente novamente.");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        return { token };
    },
};