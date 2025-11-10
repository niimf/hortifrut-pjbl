const IOrderRepository = require('../../../domain/repositories/IOrderRepository');
const Order = require('../../../domain/entities/Order.entity');
const AzureSQLConnection = require('./connection');
const sql = require('mssql');

class OrderRepository extends IOrderRepository {
  async create(order) {
    const pool = await AzureSQLConnection.getPool();
    
    const result = await pool.request()
      .input('customerName', sql.NVarChar, order.customerName)
      .input('total', sql.Decimal(10, 2), order.total)
      .input('status', sql.NVarChar, order.status)
      .query(`
        INSERT INTO orders (customerName, total, status, createdAt)
        OUTPUT INSERTED.*
        VALUES (@customerName, @total, @status, GETDATE())
      `);

    const saved = result.recordset[0];
    
    return new Order({
      id: saved.id,
      customerName: saved.customerName,
      total: saved.total,
      status: saved.status,
      createdAt: saved.createdAt
    });
  }

  async findAll() {
    const pool = await AzureSQLConnection.getPool();
    const result = await pool.request().query('SELECT * FROM orders');
    
    return result.recordset.map(o => new Order({
      id: o.id,
      customerName: o.customerName,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt
    }));
  }

  async findById(id) {
    const pool = await AzureSQLConnection.getPool();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM orders WHERE id = @id');

    if (result.recordset.length === 0) {
      return null;
    }

    const o = result.recordset[0];
    return new Order({
      id: o.id,
      customerName: o.customerName,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt
    });
  }

  async update(id, order) {
    const pool = await AzureSQLConnection.getPool();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('customerName', sql.NVarChar, order.customerName)
      .input('total', sql.Decimal(10, 2), order.total)
      .input('status', sql.NVarChar, order.status)
      .query(`
        UPDATE orders 
        SET customerName = @customerName, total = @total, status = @status
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return null;
    }

    const updated = result.recordset[0];
    return new Order({
      id: updated.id,
      customerName: updated.customerName,
      total: updated.total,
      status: updated.status,
      createdAt: updated.createdAt
    });
  }

  async delete(id) {
    const pool = await AzureSQLConnection.getPool();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM orders WHERE id = @id');

    return result.rowsAffected[0] > 0;
  }
}

module.exports = OrderRepository;
