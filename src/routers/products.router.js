import { Router } from "express";
import Product from "../product.js";
import ProductManager from "../productManager.js";

const productsPath = "./src/storage/products.json";

const ProductsRouter = Router();

/* 
Given the id returns the product
*/
ProductsRouter.get("/:pid", (req, res) => {
  const requestedProducts = {};
  let returnStatus = 200;
  
  const { pid } = req.params;
  const pId = Number(pid ?? 0);

  if (isNaN(pId) || pId < 1 || pId % 1 !== 0) {
    returnStatus = 400;
    requestedProducts.status = "error";
    requestedProducts.message = "Error: Product id must be a positive integer.";
  } else {

    const productManager = new ProductManager(productsPath);

    const requestedProduct = productManager.getProductById(pId);

    if (requestedProduct) {
      requestedProducts.status = "success";
      requestedProducts.product = requestedProduct;
    } else {
      requestedProducts.status = "fail";
      requestedProducts.message = `No product with id ${pid} was found.`;
    }
  }
  res.status(returnStatus).json(requestedProducts).end();
});

/* 
Through "limit" and "offset" returns the requested amount of products
*/
ProductsRouter.get("/", (req, res) => {
  const requestedProducts = {};
  let returnStatus = 200;
  const { limit, offset } = req.query;
  const numLimit = Number(limit ?? 0);

  if (isNaN(numLimit) || numLimit < 0 || numLimit % 1 !== 0) {
    returnStatus = 400;
    requestedProducts.status = "error";
    requestedProducts.message = 'Error: Parameter "limit" cannot be a negative integer';
  } else {
    const numOffset = Number(offset ?? 0);

    if (isNaN(numOffset) || numOffset < 0 || numOffset % 1 !== 0) {
      returnStatus = 400;
      requestedProducts.status = "error";
      requestedProducts.message = 'Error: Parameter "offset" cannot be a negative integer';
    } else {
      const productManager = new ProductManager(productsPath);
      const allProducts = productManager.getProducts();

      if (numOffset < allProducts.length) {
        let requestedObjects = [];
        if (numLimit === 0) {
          requestedObjects = allProducts;
        } else {
          requestedObjects = allProducts.slice(numOffset, numOffset + numLimit);
        }

        requestedProducts.status = "success";
        requestedProducts.products = requestedObjects;
      } else {
        returnStatus = 400;
        requestedProducts.status = "error";
        requestedProducts.message =
          'RangeError: Parameter "offset" is out of bounds.';
      }
    }
  }
  res.status(returnStatus).json(requestedProducts).end();
});

/* 
Creates a new product and saves it ProductManager.json
 */
ProductsRouter.post("/", (req, res) => {
  try {
    const { title, description, price, thumbnail, stock, code, category, status } = req.body;
    const product = new Product(title, description, price, thumbnail, stock, code, category, status);
    ProductManager.addProduct(product);

    const productsList = ProductManager.getProducts();
    req.io.emit('listChange', productsList);

    res.status(201).json(product);
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
});

/* 
Given the product id the values of the product in 
ProductManager.json are updated
*/
ProductsRouter.put("/:pid", (req, res) => {
  try {
    const { pid } = req.params;
    const { title, description, price, thumbnail, stock, code, category, status } = req.body;
    const product = new Product(title, description, price, thumbnail, stock, code, category, status);
    ProductManager.updateProductById(Number(pid), product);
    console.log(req)

    const productsList = ProductManager.getProducts();
    req.io.emit('listChange', productsList);

    res.status(200).json(product);
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
});

/* 
Given the products id the product in ProductManager.json 
is deleted.
*/
ProductsRouter.delete("/:pid", (req, res) => {
    try {
    const { pid } = req.params;
    ProductManager.deleteProductById(pid);

    const productsList = ProductManager.getProducts();
    req.io.emit('listChange', productsList);

    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
});

export default ProductsRouter;