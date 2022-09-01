const fs = require("fs");
const path = require("path");
const rootpath = require("../util/path");

const p = path.join(path.dirname(rootpath), "/express_1.1/data", "cart.json");
// const p = path.join(
//   path.dirname(process.mainModule.filename),
//   "data",
//   "products.json"
// );

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Step 1 =  Fetcht the existing cart
    console.log(p);
    fs.readFile(p, (err, fileContent) => {
      //   console.log(err, "model cart error");
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Step 2 =  Find the existing product in the cart
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id == id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProduct] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.productPrice + productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
    // Step 3 =  Add the product or increase the quantity of product
  }
};
