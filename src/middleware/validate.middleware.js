const ApiError = require('../utils/ApiError');

// Runs a validator function (req => string[]) and returns 400 if it reports errors.
exports.validate = (validator) => (req, res, next) => {
  const errors = validator(req);
  if (errors.length) return next(new ApiError(400, 'Validation failed.', errors));
  next();
};

// Ensures :id is a positive integer.
exports.validateId = (req, res, next) => {
  if (!/^[1-9]\d*$/.test(req.params.id)) {
    return next(new ApiError(400, 'Invalid ID. ID must be a positive integer.'));
  }
  next();
};
