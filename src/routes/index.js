const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/blogs', require('./blog.routes'));

module.exports = router;
