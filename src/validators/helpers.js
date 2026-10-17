exports.isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

exports.isValidEmail = (value) =>
  typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

exports.MIN_PASSWORD_LENGTH = 8;
exports.MAX_PASSWORD_LENGTH = 64; // bcrypt only uses the first 72 bytes

// Returns a list of problems with a NEW password (empty list = strong enough).
// Only used when a password is created or changed - never at login, so existing accounts keep working.
exports.passwordProblems = (password) => {
  if (typeof password !== 'string' || !password) return ['password is required.'];
  const problems = [];
  if (password.length < exports.MIN_PASSWORD_LENGTH) problems.push(`password must be at least ${exports.MIN_PASSWORD_LENGTH} characters long.`);
  if (password.length > exports.MAX_PASSWORD_LENGTH) problems.push(`password must be at most ${exports.MAX_PASSWORD_LENGTH} characters long.`);
  if (!/[a-z]/.test(password)) problems.push('password must contain a lowercase letter.');
  if (!/[A-Z]/.test(password)) problems.push('password must contain an uppercase letter.');
  if (!/\d/.test(password)) problems.push('password must contain a number.');
  if (!/[^A-Za-z0-9\s]/.test(password)) problems.push('password must contain a special character (e.g. @ ! # $ %).');
  if (/\s/.test(password)) problems.push('password must not contain spaces.');
  return problems;
};

// Must match the column sizes in the models.
exports.MAX_LENGTH = { name: 100, email: 255, blogTitle: 255, category: 100 };

exports.isTooLong = (value, max) => typeof value === 'string' && value.trim().length > max;
