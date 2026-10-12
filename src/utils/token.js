const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config');

exports.signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

exports.verifyToken = (token) => jwt.verify(token, jwtConfig.secret);
