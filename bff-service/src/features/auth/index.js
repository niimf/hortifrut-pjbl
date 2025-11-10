const LoginUserUseCase = require('../../application/use-cases/LoginUser.usecase');

class AuthFeature {
  constructor() {
    this.loginUseCase = new LoginUserUseCase();
  }

  async login(req, res) {
    try {
      const { username } = req.body;

      if (!username) {
        return res.status(400).json({
          success: false,
          error: 'Username is required'
        });
      }

      const user = await this.loginUseCase.execute(username);
      
      res.status(200).json({
        success: true,
        token: user.token,
        message: 'Login successful'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = AuthFeature;
