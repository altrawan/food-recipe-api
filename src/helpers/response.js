module.exports = {
  success: (res, status, message, data, pagination) => {
    const result = {};
    result.status = status || 200;
    result.message = message;
    result.data = data;
    result.pagination = pagination;
    return res.status(result.status).json(result);
  },
  failed: (res, status, message, error) => {
    const result = {};
    result.status = status || 200;
    result.message = message;
    result.error = error;
    return res.status(result.status).json(result);
  },
  successWithToken: (res, status, message, token) => {
    res.json({
      status,
      message,
      token
    });
  },
};
