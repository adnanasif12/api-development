const { isNonEmptyString, isValidEmail, isTooLong, MAX_LENGTH, MIN_PASSWORD_LENGTH } = require('./helpers');

exports.registerValidator = (req) => {
  const { firstname, lastname, email, password } = req.body;
  const errors = [];
  if (!isNonEmptyString(firstname)) errors.push('firstname is required.');
  if (!isNonEmptyString(lastname)) errors.push('lastname is required.');
  if (isTooLong(firstname, MAX_LENGTH.name)) errors.push(`firstname must be at most ${MAX_LENGTH.name} characters.`);
  if (isTooLong(lastname, MAX_LENGTH.name)) errors.push(`lastname must be at most ${MAX_LENGTH.name} characters.`);
  if (!isValidEmail(email)) errors.push('A valid email is required.');
  else if (isTooLong(email, MAX_LENGTH.email)) errors.push(`email must be at most ${MAX_LENGTH.email} characters.`);
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
  }
  return errors;
};

exports.loginValidator = (req) => {
  const { email, password } = req.body;
  const errors = [];
  if (!isValidEmail(email)) errors.push('A valid email is required.');
  if (!isNonEmptyString(password)) errors.push('password is required.');
  return errors;
};
