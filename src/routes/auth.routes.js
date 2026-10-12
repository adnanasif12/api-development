const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate.middleware');
const { registerValidator, loginValidator } = require('../validators/auth.validator');

router.post('/register', validate(registerValidator), controller.register);
router.post('/login', validate(loginValidator), controller.login);

module.exports = router;
