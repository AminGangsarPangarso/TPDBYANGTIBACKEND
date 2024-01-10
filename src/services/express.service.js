import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
import globalErrorHandler from "../middlewares/errorHandler.middleware";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cors from "cors";

const routeFiles = fs
    .readdirSync(__dirname + "/../routes/")
    .filter((file) => file.endsWith(".js"));

const expressService = {
    init: async () => {
        try {
            const routes = [];
            for (const file of routeFiles) {
                const route = await import(`../routes/${file}`);
                const routeName = Object.keys(route)[0];
                routes.push(route[routeName]);
            }

            const server = express();
            server.use(morgan("tiny"));
            server.use(bodyParser.json());
            server.use(compression());
            server.use(
                helmet({
                    crossOriginResourcePolicy: false,
                })
            );
            server.use(
                cors({
                    origin: "*",
                })
            );
            server.use(express.urlencoded({ extended: true }));
            server.use(express.static(`${__dirname}/../../public`));
            server.use(routes);
            server.use(globalErrorHandler);

            const port = process.env.APP_PORT
            server.listen(port);
            console.log("[EXPRESS] Express initialized");
            console.log(`[EXPRESS] App listening at http://localhost:${port}`);
        } catch (error) {
            console.log("[EXPRESS] Error during express service initialization");
            throw error;
        }
    },
};

export default expressService;
