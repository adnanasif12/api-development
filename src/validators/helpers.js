exports.isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

exports.isValidEmail = (value) =>
  typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

exports.MIN_PASSWORD_LENGTH = 6;

// Must match the column sizes in the models.
exports.MAX_LENGTH = { name: 100, email: 255, blogTitle: 255, category: 100 };

exports.isTooLong = (value, max) => typeof value === 'string' && value.trim().length > max;
