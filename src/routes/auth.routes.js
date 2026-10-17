const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate.middleware');
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../validators/auth.validator');

router.post('/register', validate(registerValidator), controller.register);
router.post('/login', validate(loginValidator), controller.login);

router.post('/forgot-password', validate(forgotPasswordValidator), controller.forgotPassword);
router.patch('/reset-password/:token', validate(resetPasswordValidator), controller.resetPassword);

module.exports = router;
