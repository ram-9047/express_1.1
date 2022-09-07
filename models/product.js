const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const Cart = require("./cart");

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    // this.id = Date.now().toString();
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id == this.id
        );
        const updatedProduct = [...products];

        console.log(updatedProduct, "before updated product");
        updatedProduct[existingProductIndex] = this;

        console.log(updatedProduct, "after updating product.json");

        fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
          console.log(err, "error in updating product");
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err, "error in adding new product");
        });
      }
    });
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.filter((prod) => prod.id == id);
      // console.log(id, product, "found that product");
      const updatedProduct = products.filter((product) => product.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        } else {
        }
        console.log(err, "error result in deleting product");
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((item) => {
        return item.id == id;
      });
      cb(product);
    });
  }
};
