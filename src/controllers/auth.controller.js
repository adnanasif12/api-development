const bcrypt = require('bcryptjs');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { signToken } = require('../utils/token');

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await User.findOne({ where: { email: normalizedEmail } });
  if (existing) throw new ApiError(409, 'A user with this email already exists.');

  // role and isActive are NEVER read from the request body.
  const user = await User.create({
    firstname: firstname.trim(),
    lastname: lastname.trim(),
    email: normalizedEmail,
    password: await bcrypt.hash(password, 10),
    role: 'user',
    isActive: true,
  });

  const { password: _omit, ...safeUser } = user.toJSON();
  res.status(201).json({ message: 'User registered successfully.', user: safeUser });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.scope('withPassword').findOne({
    where: { email: email.trim().toLowerCase() },
  });

  const passwordMatches = user && (await bcrypt.compare(password, user.password));
  if (!passwordMatches) throw new ApiError(401, 'Invalid email or password.');
  if (!user.isActive) throw new ApiError(403, 'Your account has been deactivated. Contact an admin.');

  const safeUser = await User.findByPk(user.id); // default scope hides the password
  res.status(200).json({ message: 'Login successful.', token: signToken(user), user: safeUser });
});
