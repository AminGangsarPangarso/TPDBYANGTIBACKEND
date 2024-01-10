import { IsApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
const currentEnv = process.env.NODE_ENV || 'development';

const defaultErrMsg = 'Something wen wrong';

export default (err, _req, res, next) => {
    if (res.headersSent) return next(err);
    if (IsApiError(err)) return ApiResponse(res, err.statusCode, err?.message || defaultErrMsg);
    if (currentEnv === 'development') return ApiResponse(res, 500, err?.message || defaultErrMsg);
    return ApiResponse(res, 500, defaultErrMsg);
};
