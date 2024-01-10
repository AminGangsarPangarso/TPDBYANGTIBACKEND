import { Router } from "express";
import upload from "../utils/upload"
import authMiddleware from '../middlewares/auth.middleware';
import productController from "../controllers/product.controller";

const productRoutes = Router();

productRoutes.get("/product", productController.getAll);
productRoutes.post("/product", authMiddleware('admin'), upload.single("image"), productController.create);
productRoutes.put("/product/:id", authMiddleware('admin'), upload.single("image"), productController.update);
productRoutes.delete("/product/:id", authMiddleware('admin'), productController.delete);

export { productRoutes };
