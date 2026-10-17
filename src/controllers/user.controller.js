const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { UPLOAD_DIR } = require('../middleware/upload.middleware');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// ---------- Admin ----------

// GET /api/users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({ order: [['id', 'ASC']] });
  res.status(200).json({ count: users.length, users });
});

// GET /api/users/:id
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) throw new ApiError(404, 'User not found.');
  res.status(200).json(user);
});

// PATCH /api/users/:id/status
exports.updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) throw new ApiError(404, 'User not found.');

  if (user.id === req.user.id) {
    throw new ApiError(400, 'You cannot change your own active status.');
  }

  user.isActive = req.body.isActive;
  await user.save();

  res.status(200).json({
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully.`,
    user,
  });
});

// ---------- Current user (User / Admin) ----------

// GET /api/users/profile
exports.getProfile = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// PUT /api/users/profile/update
exports.updateProfile = asyncHandler(async (req, res) => {
  const forbidden = ['role', 'isActive'].filter((field) => req.body[field] !== undefined);
  if (forbidden.length) {
    throw new ApiError(403, `You are not allowed to update: ${forbidden.join(', ')}.`);
  }

  const { firstname, lastname } = req.body;
  if (firstname !== undefined) req.user.firstname = firstname.trim();
  if (lastname !== undefined) req.user.lastname = lastname.trim();
  await req.user.save();

  res.status(200).json({ message: 'Profile updated successfully.', user: req.user });
});

// PATCH /api/users/password
exports.updatePassword = asyncHandler(async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  await User.update({ password: hashed }, { where: { id: req.user.id } });
  res.status(200).json({ message: 'Password updated successfully.' });
});

// PATCH /api/users/profile/image   (multipart/form-data, field "image")
exports.updateProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Please choose an image (field name: image).');

  const previous = req.user.profileImage;
  req.user.profileImage = `/uploads/profiles/${req.file.filename}`;
  await req.user.save();

  if (previous) fs.unlink(path.join(UPLOAD_DIR, path.basename(previous)), () => {}); // best-effort cleanup
  res.status(200).json({ message: 'Profile image updated successfully.', user: req.user });
});
