import * as Yup from "yup";
import { ApiResponse } from "../utils/apiResponse";
import midtrans from '../config/midtrans'
import Product from "../models/Product";
import Cart from "../models/Cart";
import CartProduct from "../models/CartProduct";
import { Op } from "sequelize";

const cartController = {
    checkout: async (req, res, next) => {
        try {
            const schema = Yup.object().shape({
                products: Yup.array(
                    Yup.object({
                        id: Yup.number().required(),
                        quantity: Yup.number().required()
                    })
                )
            });

            await schema.validate(req.body).catch((res) => {
                throw new ValidationError(res.message);
            });

            const productRequest = req.body.products
            const productIds = productRequest.map((product) => product.id);
            const getProducts = await Product.findAll({
                attributes: ['id', 'price'],
                where: {
                    id: {
                        [Op.in]: productIds
                    }
                }
            });

            const productData = getProducts.map(({ id, price }) => {
                const item = productRequest.find(val => val.id === id);
                const quantity = item?.quantity || 0
                return {
                    id,
                    price,
                    quantity,
                    subTotalPrice: price * quantity
                };
            })

            const totalPrice = productData.reduce((acc, val) => acc + val.subTotalPrice, 0)
            const { id: userId, username, email, phone_number } = req.user

            const cart = await Cart.create({
                user_id: userId,
                price: totalPrice,
                state: 'pending',
            })

            const bulkCartProducts = productData.map(({ id, quantity, subTotalPrice }) => ({
                cart_id: cart.id,
                product_id: id,
                quantity,
                price: subTotalPrice,
            }))

            await CartProduct.bulkCreate(bulkCartProducts)

            const parameter = {
                transaction_details: {
                    order_id: 'INFYANGTI' + cart.id,
                    gross_amount: totalPrice
                },
                credit_card: {
                    secure: true
                },
                customer_details: {
                    first_name: username,
                    email: email,
                    phone: phone_number
                }
            };
            const transaction = await midtrans.createTransaction(parameter)
            return ApiResponse(res, 200, "success checkout", transaction.token);
        } catch (error) {
            next(error);
        }
    },
    history: async (req, res, next) => {
        try {
            const getCart = await Cart.findAll({
                where: {
                    user_id: req.user.id,
                },
                attributes: {
                    exclude: ['user_id']
                },
                include: [
                    {
                        model: CartProduct,
                        as: 'cart_product',
                        attributes: ['quantity', 'price'],
                        include: [
                            {
                                model: Product,
                                as: 'product',
                                attributes: ['id', 'name', 'price', 'image'],
                            }
                        ]
                    },
                ],
            });

            const mappedCart = getCart.map(({
                id,
                price,
                state,
                created_at,
                updated_at,
                cart_product,
            }) => {
                const products = cart_product.map(({ product, quantity, price: sub_total }) => {
                    const {
                        id,
                        name,
                        price,
                        image,
                    } = product

                    return {
                        id,
                        name,
                        price,
                        image,
                        quantity,
                        sub_total
                    }
                })

                return {
                    id,
                    price,
                    state,
                    created_at,
                    updated_at,
                    products,
                }
            });

            return ApiResponse(res, 200, "success get history", mappedCart);
        } catch (error) {
            next(error);
        }
    },
};

export default cartController;
