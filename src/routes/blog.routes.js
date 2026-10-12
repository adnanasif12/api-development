const router = require('express').Router();
const controller = require('../controllers/blog.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate, validateId } = require('../middleware/validate.middleware');
const { createBlogValidator, updateBlogValidator } = require('../validators/blog.validator');

// Public (Guest)
router.get('/', controller.getAllBlogs);

// User / Admin
router.post('/create', authenticate, validate(createBlogValidator), controller.createBlog);
router.put('/update/:id', authenticate, validateId, validate(updateBlogValidator), controller.updateBlog);
router.delete('/delete/:id', authenticate, validateId, controller.deleteBlog);
router.delete('/:id', authenticate, validateId, controller.deleteBlog);

// Public (Guest) - keep after the fixed paths above
router.get('/:id', validateId, controller.getBlogById);

module.exports = router;
