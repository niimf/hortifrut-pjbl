const jwt = require('jsonwebtoken');

class JwtService {
  static generateToken(username) {
    return jwt.sign(
      { username },
      process.env.JWT_SECRET || 'hortifrut_secret_key_2025',
      { expiresIn: '24h' }
    );
  }

  static verifyToken(token) {
    try {
      return jwt.verify(
        token,
        process.env.JWT_SECRET || 'hortifrut_secret_key_2025'
      );
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

module.exports = JwtService;
