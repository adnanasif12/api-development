const User = require('./user.model');
const Blog = require('./blog.model');

// blogs.userId -> users.id
User.hasMany(Blog, { foreignKey: 'userId', as: 'blogs', onDelete: 'CASCADE' });
Blog.belongsTo(User, { foreignKey: 'userId', as: 'author' });

module.exports = { User, Blog };
