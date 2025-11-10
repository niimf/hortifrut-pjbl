// Entidade de domínio pura - sem dependências externas
class Product {
  constructor({ id, name, price, category, stock }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
    this.stock = stock;
    
    this.validate();
  }

  validate() {
    if (!this.name || this.name.trim() === '') {
      throw new Error('Product name is required');
    }
    if (this.price <= 0) {
      throw new Error('Product price must be greater than zero');
    }
    if (this.stock < 0) {
      throw new Error('Product stock cannot be negative');
    }
  }

  updateStock(quantity) {
    if (this.stock + quantity < 0) {
      throw new Error('Insufficient stock');
    }
    this.stock += quantity;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      category: this.category,
      stock: this.stock
    };
  }
}

module.exports = Product;
