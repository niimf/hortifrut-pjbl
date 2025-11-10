const IProductRepository = require('../../../domain/repositories/IProductRepository');
const ProductModel = require('./ProductModel');
const Product = require('../../../domain/entities/Product.entity');

class ProductRepository extends IProductRepository {
  async create(product) {
    const productModel = new ProductModel({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock
    });

    const saved = await productModel.save();
    
    return new Product({
      id: saved._id.toString(),
      name: saved.name,
      price: saved.price,
      category: saved.category,
      stock: saved.stock
    });
  }

  async findAll() {
    const products = await ProductModel.find();
    
    return products.map(p => new Product({
      id: p._id.toString(),
      name: p.name,
      price: p.price,
      category: p.category,
      stock: p.stock
    }));
  }

  async findById(id) {
    const product = await ProductModel.findById(id);
    
    if (!product) {
      return null;
    }

    return new Product({
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock
    });
  }

  async update(id, product) {
    const updated = await ProductModel.findByIdAndUpdate(
      id,
      {
        name: product.name,
        price: product.price,
        category: product.category,
        stock: product.stock
      },
      { new: true }
    );

    if (!updated) {
      return null;
    }

    return new Product({
      id: updated._id.toString(),
      name: updated.name,
      price: updated.price,
      category: updated.category,
      stock: updated.stock
    });
  }

  async delete(id) {
    const result = await ProductModel.findByIdAndDelete(id);
    return result !== null;
  }
}

module.exports = ProductRepository;
