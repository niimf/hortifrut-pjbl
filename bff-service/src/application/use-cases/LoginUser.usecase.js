const User = require('../../domain/entities/User.entity');
const JwtService = require('../../infrastructure/auth/JwtService');

class LoginUserUseCase {
  async execute(username) {
    // Cria entidade User
    const token = JwtService.generateToken(username);
    
    const user = new User({
      username,
      token,
      createdAt: new Date()
    });

    return user;
  }
}

module.exports = LoginUserUseCase;
