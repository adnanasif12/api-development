const router = require('express').Router();
const controller = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { validate, validateId } = require('../middleware/validate.middleware');
const {
  updateProfileValidator,
  updatePasswordValidator,
  updateStatusValidator,
} = require('../validators/user.validator');

// Every user route requires authentication.
router.use(authenticate);

// Own account (User / Admin).
// NOTE: these must be declared BEFORE "/:id" so "profile" is not treated as an id.
router.get('/profile', controller.getProfile);
router.put('/profile/update', validate(updateProfileValidator), controller.updateProfile);
router.patch('/profile/image', upload.single('image'), controller.updateProfileImage);
router.patch('/password', validate(updatePasswordValidator), controller.updatePassword);

// Admin only
router.get('/', authorize('admin'), controller.getAllUsers);
router.get('/:id', authorize('admin'), validateId, controller.getUserById);
router.patch(
  '/:id/status',
  authorize('admin'),
  validateId,
  validate(updateStatusValidator),
  controller.updateUserStatus
);

module.exports = router;
