import * as Yup from "yup";
import User from "../models/User";
import JwtService from "../services/jwt.service";
import {
    BadRequestError,
    UnauthorizedError,
    ValidationError,
} from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { Op } from "sequelize";

const authController = {
    login: async (req, res, next) => {
        try {
            const schema = Yup.object().shape({
                username: Yup.string().required(),
                password: Yup.string().required(),
            });

            await schema.validate(req.body).catch((res) => {
                throw new ValidationError(res.message);
            });

            const { username, password } = req.body;
            const user = await User.findOne({ where: { username } });
            if (!user) throw new UnauthorizedError('wrong username or password');
            if (!(await user.checkPassword(password))) throw new UnauthorizedError('wrong username or password');
            const token = JwtService.jwtSign({
                id: user.id,
                username: user.username,
                email: user.email,
                phone_number: user.phone_number,
                role: user.role,
            });
            return ApiResponse(res, 200, "login successful", {
                username: user.username,
                phone_number: user.phone_number,
                token: token
            })
        } catch (error) {
            next(error);
        }
    },
    register: async (req, res, next) => {
        try {
            const schema = Yup.object().shape({
                username: Yup.string().required(),
                password: Yup.string().required(),
                email: Yup.string().email().required(),
                phone_number: Yup.string().matches(/^62\d{8,13}$/gm, 'invalid phone number'),
            });

            await schema.validate(req.body).catch((res) => {
                throw new ValidationError(res.message);
            });

            const { username, password, email, phone_number } = req.body;
            const user = await User.findOne({
                where: {
                    [Op.or]: [{ username }, { email }]
                }
            });

            if (user) {
                if (user.username === username) throw new BadRequestError('username already exists');
                if (user.email === email) throw new BadRequestError('email already exists');
                throw new BadRequestError('username or Email already exists');
            }

            const newUser = await User.create({
                username,
                raw_password: password,
                email: email,
                phone_number: phone_number,
            });

            const token = JwtService.jwtSign({
                id: newUser.id,
                username: newUser.newUsername,
                email: newUser.email,
                phone_number: newUser.phone_number,
                role: newUser.role,
            });

            return ApiResponse(res, 200, "register successful", {
                username: newUser.username,
                phone_number: newUser.phone_number,
                token: token
            })
        } catch (error) {
            next(error);
        }
    }
};

export default authController;
