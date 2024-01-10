import jwt from "jsonwebtoken";

const JwtService = {
    jwtSign: (_payload) => {
        try {
            console.log("[JWT] Generating fastify JWT sign");
            const payload = JSON.parse(JSON.stringify(_payload));
            return jwt.sign(
                { payload },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                }
            );
        } catch (error) {
            console.log("[JWT] Error during fastify JWT sign");
            throw error;
        }
    },

    jwtGetToken: (request) => {
        try {
            if (
                !request.headers.authorization ||
                request.headers.authorization.split(" ")[0] !== "Bearer"
            ) {
                throw new Error("[JWT] JWT token not provided");
            }

            return request.headers.authorization.split(" ")[1];
        } catch (error) {
            console.log("[JWT] Error getting JWT token");
            throw error;
        }
    },

    jwtVerify: (token) => {
        try {
            return jwt.verify(
                token,
                process.env.JWT_SECRET,
                (err, decoded) => {
                    if (err != null) throw err;
                    return decoded.payload;
                }
            );
        } catch (error) {
            console.log("[JWT] Error getting JWT token");
            throw error;
        }
    },
};

export default JwtService;
