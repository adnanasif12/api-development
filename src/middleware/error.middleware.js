const ApiError = require('../utils/ApiError');

exports.notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    const body = { message: err.message };
    if (err.errors) body.errors = err.errors;
    return res.status(err.statusCode).json(body);
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: 'A record with this value already exists.' });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body.' });
  }
  console.error(err);
  res.status(500).json({ message: 'Internal server error.' });
};
