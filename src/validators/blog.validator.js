const { isNonEmptyString, isTooLong, MAX_LENGTH } = require('./helpers');

exports.createBlogValidator = (req) => {
  const { blogTitle, blog, category } = req.body;
  const errors = [];
  if (!isNonEmptyString(blogTitle)) errors.push('blogTitle is required and cannot be empty.');
  if (!isNonEmptyString(blog)) errors.push('blog content is required and cannot be empty.');
  if (!isNonEmptyString(category)) errors.push('category is required and cannot be empty.');
  if (isTooLong(blogTitle, MAX_LENGTH.blogTitle)) errors.push(`blogTitle must be at most ${MAX_LENGTH.blogTitle} characters.`);
  if (isTooLong(category, MAX_LENGTH.category)) errors.push(`category must be at most ${MAX_LENGTH.category} characters.`);
  return errors;
};

exports.updateBlogValidator = (req) => {
  const { blogTitle, blog, category } = req.body;
  const errors = [];
  if (blogTitle === undefined && blog === undefined && category === undefined) {
    errors.push('Provide at least one of: blogTitle, blog, category.');
  }
  if (blogTitle !== undefined && !isNonEmptyString(blogTitle)) errors.push('blogTitle cannot be empty.');
  if (blog !== undefined && !isNonEmptyString(blog)) errors.push('blog content cannot be empty.');
  if (category !== undefined && !isNonEmptyString(category)) errors.push('category cannot be empty.');
  if (isTooLong(blogTitle, MAX_LENGTH.blogTitle)) errors.push(`blogTitle must be at most ${MAX_LENGTH.blogTitle} characters.`);
  if (isTooLong(category, MAX_LENGTH.category)) errors.push(`category must be at most ${MAX_LENGTH.category} characters.`);
  return errors;
};
