import { authService } from "../services/authService.js";

export const authController = {
    register: async (req, res) => {
        try {
            const user = await authService.register(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { token } = await authService.login(req.body);
            res.status(200).json({ token });
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },
};