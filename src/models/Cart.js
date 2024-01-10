import Sequelize, { Model } from "sequelize";
import { User } from './User'

class Cart extends Model {
    static order = 3;
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    unique: true,
                    primaryKey: true,
                    autoIncrement: true,
                },
                user_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: User,
                        key: "id",
                    },
                },
                price: {
                    type: Sequelize.DECIMAL(10, 2),
                    allowNull: false,
                },
                state: {
                    type: Sequelize.ENUM("pending", "processing", "shipped", "delivered", "canceled"),
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'cart',
                freezeTableName: true,
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.User, {
            as: "user",
            foreignKey: "user_id",
        });

        this.hasMany(models.CartProduct, {
            as: "cart_product",
            foreignKey: "cart_id",
        })
    }
}

export default Cart;
