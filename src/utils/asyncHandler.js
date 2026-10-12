// Forwards errors from async controllers to the error-handling middleware.
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
