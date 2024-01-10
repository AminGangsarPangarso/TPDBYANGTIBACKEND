import Sequelize, { Model } from "sequelize";
import Product from './Product'
import Cart from "./Cart";

class CartProduct extends Model {
    static order = 4;
    static init(sequelize) {
        super.init(
            {
                cart_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: Cart,
                        key: "id",
                    },
                },
                product_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: Product,
                        key: "id",
                    },
                },
                quantity: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                price: {
                    type: Sequelize.DECIMAL(10, 2),
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'cart_product',
                freezeTableName: true,
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.Cart, {
            as: "cart",
            foreignKey: "cart_id",
        });

        this.belongsTo(models.Product, {
            as: "product",
            foreignKey: "product_id",
        });
    }
}

export default CartProduct;
