import Sequelize, { Model } from "sequelize";
import bcrypt from "bcrypt";

class User extends Model {
    static order = 1;
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                username: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true,
                },
                password: Sequelize.STRING,
                email: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true,
                },
                phone_number: Sequelize.STRING,
                role: {
                    type: Sequelize.ENUM('admin', 'customer'),
                    allowNull: false,
                    defaultValue: 'customer',
                },
                raw_password: Sequelize.VIRTUAL,
            },
            {
                sequelize,
                tableName: 'user',
                freezeTableName: true,
            }
        );

        this.addHook('beforeCreate', async (user) => {
            if (user.raw_password) {
                user.password = await bcrypt.hash(user.raw_password, 8);
            }
        })

        return this;
    }

    checkPassword(raw_password) {
        return bcrypt.compare(raw_password, this.password);
    }
}

export default User;
