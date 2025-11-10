const sql = require('mssql');
require('dotenv').config();

// DEBUG: mostrar variáveis
console.log('DEBUG - Environment variables:');
console.log('AZURE_SQL_SERVER:', process.env.AZURE_SQL_SERVER);
console.log('AZURE_SQL_DATABASE:', process.env.AZURE_SQL_DATABASE);
console.log('AZURE_SQL_USER:', process.env.AZURE_SQL_USER);
console.log('AZURE_SQL_PASSWORD:', process.env.AZURE_SQL_PASSWORD ? '***' : 'UNDEFINED');

const config = {
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

class AzureSQLConnection {
  static pool = null;

  static async connect() {
    try {
      if (!this.pool) {
        this.pool = await sql.connect(config);
        console.log('✓ Azure SQL Database connected successfully');
      }
      return this.pool;
    } catch (error) {
      console.error('✗ Azure SQL connection error:', error.message);
      throw error;
    }
  }

  static async getPool() {
    if (!this.pool) {
      await this.connect();
    }
    return this.pool;
  }

  static async disconnect() {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
      console.log('Azure SQL disconnected');
    }
  }
}

module.exports = AzureSQLConnection;
