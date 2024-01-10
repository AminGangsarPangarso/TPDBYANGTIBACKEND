import * as Yup from "yup";
import Product from "../models/Product";
import {
    NotFoundError,
    ValidationError,
} from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { removeImage, removeImageFullPath } from "../utils/upload";

const productController = {
    getAll: async (req, res, next) => {
        try {
            const product = await Product.findAll({
                attributes: {
                    exclude: [
                        "created_at",
                        "updated_at",
                    ],
                },
                order: [["id", "DESC"]],
            });

            return ApiResponse(res, 200, "success get all product", product);
        } catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required(),
                price: Yup.number().required(),
                description: Yup.string().required(),
            });

            await schema.validate(req.body).catch((res) => {
                throw new ValidationError(res.message);
            });

            if (!req?.file) throw new ValidationError('image is required');

            const { name, price, description } = req.body;
            await Product.create({
                name,
                price,
                description,
                image: req.file.filename,
            })

            return ApiResponse(res, 201, "success create product");
        } catch (error) {
            if (!!req?.file) await removeImageFullPath(req.file.path)
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const schema = Yup.object().shape({
                name: Yup.string(),
                price: Yup.number(),
                description: Yup.string(),
            });

            await schema.validate(req.body).catch((res) => {
                throw new ValidationError(res.message);
            });

            const { id } = req.params;
            const oldProduct = await Product.findByPk(id);
            if (!oldProduct) throw new NotFoundError("product not found");
            
            const { name, price, description } = req.body;
            await Product.update({
                name: name ?? oldProduct.name,
                price: price ?? oldProduct.price,
                description: description ?? oldProduct.description,
                image: req?.file?.filename ?? oldProduct.image,
            }, {
                where: {
                    id,
                },
            })

            await removeImage(oldProduct.image)
            return ApiResponse(res, 201, "success update product");
        } catch (error) {
            if (!!req?.file) await removeImageFullPath(req.file.path)
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            const { id } = req.params;
            const oldProduct = await Product.findByPk(id);
            if (!oldProduct) throw new NotFoundError("product not found");
            await Product.destroy({
                where: {
                    id,
                }
            })
            await removeImage(oldProduct.image)
            return ApiResponse(res, 201, "success delete product");
        } catch (error) {
            next(error);
        }
    }
};

export default productController;
