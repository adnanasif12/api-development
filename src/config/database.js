const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const { db } = require('./index');

const sequelize = new Sequelize(db.name, db.user, db.password, {
  host: db.host,
  port: db.port,
  dialect: 'mysql',
  logging: false,
});

// Creates the "blogdb" database if it does not exist yet.
async function ensureDatabase() {
  const connection = await mysql.createConnection({
    host: db.host,
    port: db.port,
    user: db.user,
    password: db.password,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${db.name}\``);
  await connection.end();
}

module.exports = { sequelize, ensureDatabase };
