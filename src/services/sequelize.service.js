import { Sequelize } from "sequelize";
import databaseConfig from "../config/database";
import fs from "fs";
import User from '../models/User'

const modelFiles = fs
    .readdirSync(__dirname + "/../models/")
    .filter((file) => file.endsWith(".js"));

const initialFirstUser = async () => {
    const username = process.env.DEFAULT_USER_NAME
    const user = await User.findOne({
        where: {
            username,
        },
    });

    if (!user) {
        await User.create({
            username,
            raw_password: process.env.DEFAULT_USER_PASSWORD,
            email: process.env.DEFAULT_USER_EMAIL,
            phone_number: process.env.DEFAULT_USER_PHONE_NUMBER,
            role: 'admin',
        });
    }
}

const sequelizeService = {
    init: async () => {
        try {
            const connection = new Sequelize(databaseConfig);
            const modelFilesWithOrder = [];
            await Promise.all(modelFiles.map(async (file) => {
                const model = await import(`../models/${file}`);
                modelFilesWithOrder.push({
                    file,
                    order: model.default.order,
                });
            }));

            modelFilesWithOrder.sort((a, b) => a.order - b.order);
            for (const file of modelFilesWithOrder) {
                const model = await import(`../models/${file.file}`);
                model.default.init(connection);
            }
            
            await Promise.all(modelFilesWithOrder.map(async ({file}) => {
                const model = await import(`../models/${file}`);
                model.default.associate && model.default.associate(connection.models);
            }));
            
            await Promise.all(modelFilesWithOrder.map(async ({ file }) => {
                const model = await import(`../models/${file}`);
                await model.default.sync();
            }));

            await initialFirstUser();

            console.log("[SEQUELIZE] Database service initialized");
        } catch (error) {
            console.log("[SEQUELIZE] Error during database service initialization");
            throw error;
        }
    },
};

export default sequelizeService;
