// Usage: npm run seed:admin
// Creates (or promotes) an admin user. Override defaults with env vars:
//   ADMIN_EMAIL, ADMIN_PASSWORD
const bcrypt = require('bcryptjs');
const { sequelize, ensureDatabase } = require('../src/config/database');
const { User } = require('../src/models');

const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
const password = process.env.ADMIN_PASSWORD || 'password123';

(async () => {
  await ensureDatabase();
  await sequelize.sync();

  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      firstname: 'Admin',
      lastname: 'User',
      password: await bcrypt.hash(password, 10),
      role: 'admin',
      isActive: true,
    },
  });

  if (!created) {
    user.role = 'admin';
    user.isActive = true;
    await user.save();
  }

  console.log(`Admin ready -> email: ${email}${created ? `, password: ${password}` : ' (existing user promoted)'}`);
  await sequelize.close();
})();
