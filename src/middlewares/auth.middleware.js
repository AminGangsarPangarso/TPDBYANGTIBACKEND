import JwtService from "../services/jwt.service";
import { BadTokenError, ForbiddenError } from "../utils/apiError"

const authMiddleware = (role = 'customer') => async (req, res, next) => {
	try {
		const token = JwtService.jwtGetToken(req);
		const user = JwtService.jwtVerify(token);
		req.user = user;
	} catch (error) {
		return next(new BadTokenError())
	}

	if (!req?.user) return next(new BadTokenError())
	const userRole = req.user.role;
	if (role !== userRole && userRole !== 'admin') return next(new ForbiddenError())
	return next();
};

export default authMiddleware;
