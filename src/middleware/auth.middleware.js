const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { verifyToken } = require('../utils/token');
const { User } = require('../models');

// Requires a valid "Authorization: Bearer <token>" header.
exports.authenticate = asyncHandler(async (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw new ApiError(401, 'Authentication required. Please provide a Bearer token.');
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new ApiError(401, 'Invalid or expired token.');
  }

  const user = await User.findByPk(payload.id);
  if (!user) throw new ApiError(401, 'User no longer exists.');
  if (!user.isActive) throw new ApiError(403, 'Your account has been deactivated.');

  req.user = user;
  next();
});

// Restricts a route to the given roles, e.g. authorize('admin').
exports.authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action.'));
    }
    next();
  };
