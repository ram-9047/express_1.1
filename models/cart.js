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
        // console.log(updatedProduct.qty);
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
    // Step 3 =  Add the product or increase the quantity of product
  }

  static deleteProduct = (id, productPrice) => {
    fs.readFile(p, (err, fileContent) => {
      // error means there is nothing to delete in cart, as the product is not added in the cart
      if (err) {
        return;
      }

      // if there is no error means product is avail in the cart
      // step-1 => copy the cart
      const updatedCart = { ...JSON.parse(fileContent) };
      console.log(updatedCart, "updated cart");

      // step-2 => find that product
      const product = updatedCart.products.find((prod) => prod.id == id);

      // step-3 => fint the quantity of product
      const productQty = product.qty;

      //step-4 => remove the product from updatedCart using filter() method
      updatedCart.products = updatedCart.products.filter(
        (product) => product.id !== id
      );

      // step-5 => update the price of the cart
      updatedCart.totalPrice =
        updatedCart.totalPrice - productQty * productPrice;
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err, "error in removing product from cart");
      });
    });
  };
};
