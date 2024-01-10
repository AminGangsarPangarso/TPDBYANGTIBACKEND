const ApiResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        status: statusCode === 200 ? 'success' : 'failed',
        message,
        data,
    });
}

export {
    ApiResponse,
}