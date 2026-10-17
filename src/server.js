const app = require('./app');
const config = require('./config');
const { sequelize, ensureDatabase } = require('./config/database');
require('./models'); // registers models and associations

async function start() {
  try {
    await ensureDatabase();
    await sequelize.authenticate();
    await sequelize.sync(); // creates the users and blogs tables if missing
    await require('./models').User.sync({ alter: true }); // adds new user columns (profileImage, reset token)
    console.log('Database connected.');

    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error.message);
    process.exit(1);
  }
}

start();
