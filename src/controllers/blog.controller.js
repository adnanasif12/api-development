const { Op } = require('sequelize');
const { Blog, User } = require('../models');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Include the author, exposing only non-sensitive fields.
const withAuthor = {
  model: User,
  as: 'author',
  attributes: ['id', 'firstname', 'lastname', 'profileImage'],
};

// Escape LIKE wildcards so "50%" is searched literally.
const escapeLike = (text) => text.replace(/[\\%_]/g, '\\$&');

// Loads a blog and checks the current user may modify it (owner or admin).
async function findModifiableBlog(req, action) {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog) throw new ApiError(404, 'Blog not found.');

  const isOwner = blog.userId === req.user.id;
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) {
    throw new ApiError(403, `You are not authorized to ${action} this blog.`);
  }
  return blog;
}

// ---------- Guest (public) ----------

// GET /api/blogs?title=...&category=...
exports.getAllBlogs = asyncHandler(async (req, res) => {
  const { title, category } = req.query;
  const where = {};

  if (typeof title === 'string' && title.trim()) {
    where.blogTitle = { [Op.like]: `%${escapeLike(title.trim())}%` };
  }
  if (typeof category === 'string' && category.trim()) {
    where.category = category.trim();
  }

  const blogs = await Blog.findAll({ where, include: withAuthor, order: [['id', 'DESC']] });
  res.status(200).json({ count: blogs.length, blogs });
});

// GET /api/blogs/:id
exports.getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findByPk(req.params.id, { include: withAuthor });
  if (!blog) throw new ApiError(404, 'Blog not found.');
  res.status(200).json(blog);
});

// ---------- User / Admin ----------

// POST /api/blogs/create
exports.createBlog = asyncHandler(async (req, res) => {
  const { blogTitle, blog, category } = req.body;

  // userId comes from the token, never from the request body.
  const created = await Blog.create({
    userId: req.user.id,
    blogTitle: blogTitle.trim(),
    blog: blog.trim(),
    category: category.trim(),
  });

  res.status(201).json({ message: 'Blog created successfully.', blog: created });
});

// PUT /api/blogs/update/:id
exports.updateBlog = asyncHandler(async (req, res) => {
  const blog = await findModifiableBlog(req, 'update');

  const { blogTitle, blog: content, category } = req.body;
  if (blogTitle !== undefined) blog.blogTitle = blogTitle.trim();
  if (content !== undefined) blog.blog = content.trim();
  if (category !== undefined) blog.category = category.trim();
  await blog.save();

  res.status(200).json({ message: 'Blog updated successfully.', blog });
});

// DELETE /api/blogs/:id   (also available as /api/blogs/delete/:id)
exports.deleteBlog = asyncHandler(async (req, res) => {
  const blog = await findModifiableBlog(req, 'delete');
  await blog.destroy();
  res.status(200).json({ message: 'Blog deleted successfully.' });
});
