import { Router } from "express";

import authController from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/login", authController.login);
authRoutes.post("/register", authController.register);

export { authRoutes };
