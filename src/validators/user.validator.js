const { isNonEmptyString, isTooLong, MAX_LENGTH, passwordProblems } = require('./helpers');

exports.updateProfileValidator = (req) => {
  const { firstname, lastname } = req.body;
  const errors = [];
  if (firstname === undefined && lastname === undefined) {
    errors.push('Provide at least one of: firstname, lastname.');
  }
  if (firstname !== undefined && !isNonEmptyString(firstname)) errors.push('firstname cannot be empty.');
  if (lastname !== undefined && !isNonEmptyString(lastname)) errors.push('lastname cannot be empty.');
  if (isTooLong(firstname, MAX_LENGTH.name)) errors.push(`firstname must be at most ${MAX_LENGTH.name} characters.`);
  if (isTooLong(lastname, MAX_LENGTH.name)) errors.push(`lastname must be at most ${MAX_LENGTH.name} characters.`);
  return errors;
};

exports.updatePasswordValidator = (req) => {
  return passwordProblems(req.body.password);
};

exports.updateStatusValidator = (req) => {
  if (typeof req.body.isActive !== 'boolean') return ['isActive must be a boolean (true or false).'];
  return [];
};
