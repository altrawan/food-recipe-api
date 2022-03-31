module.exports = {
  success: (res, code, status, message, data, pagination) => {
    const result = {};
    result.code = code || 200
    result.status = status || 'success';
    result.message = message;
    result.data = data;
    result.pagination = pagination;
    return res.status(result.code).json(result);
  },
  failed: (res, code, status, message, error) => {
    const result = {};
    result.code = code || 400;
    result.status = status || 'failed';
    result.message = message;
    result.error = error;
    return res.status(result.code).json(result);
  },
  successWithToken: (res, status, message, token) => {
    const result = {};
    result.code = code || 200;
    result.status = status || 'success';
    result.message = message;
    result.token = token;
    return res.status(result.code).json(result);
  },
};
