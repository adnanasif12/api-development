const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const config = require('../config');
const { sendMail } = require('../utils/mailer');
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

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

// POST /api/auth/forgot-password
// Always answers the same way so the endpoint cannot be used to discover registered emails.
exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email.trim().toLowerCase() } });

  if (user && user.isActive) {
    const token = crypto.randomBytes(32).toString('hex');
    await user.update({ resetPasswordToken: hashToken(token), resetPasswordExpires: new Date(Date.now() + RESET_TTL_MS) });
    const link = `${config.frontendUrl}/reset-password/${token}`;
    await sendMail({
      to: user.email,
      subject: 'Reset your BlogSpace password',
      text: `Hi ${user.firstname},\n\nUse this link to reset your password (valid for 1 hour):\n${link}\n\nIf you did not request this, ignore this email.`,
    });
  }

  res.status(200).json({ message: 'If that email is registered, a password reset link has been sent.' });
});

// PATCH /api/auth/reset-password/:token
exports.resetPassword = asyncHandler(async (req, res) => {
  const user = await User.unscoped().findOne({ where: { resetPasswordToken: hashToken(req.params.token) } });
  if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
    throw new ApiError(400, 'Reset link is invalid or has expired.');
  }

  await user.update({
    password: await bcrypt.hash(req.body.password, 10),
    resetPasswordToken: null,
    resetPasswordExpires: null,
  });
  res.status(200).json({ message: 'Password successfully changed.' });
});
