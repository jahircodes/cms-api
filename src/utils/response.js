const sendSuccess = (res, data = null, message = 'success') => {
  return res.json({ success: true, message, data });
};

const sendError = (res, statusCode = 500, message = 'error') => {
  return res
    .status(statusCode)
    .json({ success: false, message, code: statusCode, requestId: res.locals.requestId });
};

module.exports = { sendSuccess, sendError };
