class User {
  constructor({ username, token, createdAt }) {
    this.username = username;
    this.token = token;
    this.createdAt = createdAt || new Date();
    
    this.validate();
  }

  validate() {
    if (!this.username || this.username.trim() === '') {
      throw new Error('Username is required');
    }
  }

  toJSON() {
    return {
      username: this.username,
      token: this.token,
      createdAt: this.createdAt
    };
  }
}

module.exports = User;
