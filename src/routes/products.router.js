import { Router } from "express";
import Product from "../product.js";
import ProductManager from "../productManager.js";

const productsPath = "public/products.json";

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
  const requestedProducts = {};
  let returnStatus = 201;

  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    status,
    thumbnail,
  } = req.body;

  if (!!title || !!description || !!code || !!price || !!stock || !!category) {
    returnStatus = 400;
    requestedProducts.status = "error";
  } else {
    try {
      const product = new Product(
        title,
        description,
        code,
        price,
        stock,
        category,
        status,
        thumbnail
      );

      const productManager = new ProductManager(productsPath);
      const newId = productManager.addProduct(product);

      if (newId !== -1) {
        requestedProducts.status = "success";
        requestedProducts.product = productManager.getProductById(newId);
      } else {
        returnStatus = 400;
        requestedProducts.status = "fail";
      }
    } catch (err) {
      returnStatus = 400;
      requestedProducts.status = "error";
      requestedProducts.message = err.message;
    }
  }
  res.status(returnStatus).json(requestedProducts).end();
});

/* 
Given the product id the values of the product in 
ProductManager.json are updated
*/
ProductsRouter.put("/:pid", (req, res) => {
  const requestedProducts = {};
  let returnStatus = 200;

  const { pid } = req.params;
  const pId = Number(pid ?? 0);

  if (isNaN(pId) || pId < 1 || pId % 1 !== 0) {
    returnStatus = 400;
    requestedProducts.status = "error";
    requestedProducts.message = "Error: Product id value must be a positive integer.";
  } else {
    const {
      title,
      description,
      code,
      price,
      stock,
      category,
      status,
      thumbnail,
    } = req.body;

    const productManager = new ProductManager(productsPath);
    const existingProduct = productManager.getProductById(pId);

    if (existingProduct) {
      try {
        updateProduct = new Product(
          title ?? existingProduct.title,
          description ?? existingProduct.description,
          code ?? existingProduct.code,
          price ?? existingProduct.price,
          stock ?? existingProduct.stock,
          category ?? existingProduct.category,
          status ?? existingProduct.status,
          thumbnail ?? existingProduct.thumbnail
        );

        if (productManager.updateProduct(pId, updateProduct)) {
          requestedProducts.status = "success";
          requestedProducts.updateCount = 1;
          requestedProducts.product = productManager.getProductById(pId);
        } else {
          returnStatus = 400;
          requestedProducts.status = "fail";
          requestedProducts.message = "Fail: Product couldn't be updated.";
        }
      } catch (err) {
        returnStatus = 400;
        requestedProducts.status = "error";
        requestedProducts.message = err.message;
      }
    } else {
      returnStatus = 400;
      requestedProducts.status = "fail";
      requestedProducts.message = `Product ${pid} wasn't found.`;
    }
  }
  res.status(returnStatus).json(requestedProducts).end();
});

/* 
Given the products id the product in ProductManager.json 
is deleted.
*/
ProductsRouter.delete("/:pid", (req, res) => {
  const requestedProducts = {};
  let returnStatus = 200;

  const { pid: pid } = req.params;
  const pId = Number(pid ?? 0);

  if (isNaN(pId) || pId < 1 || pId % 1 !== 0) {
    returnStatus = 400;
    requestedProducts.status = "error";
    requestedProducts.message = "Error: Product id must be a positive integer.";
  } else {
    const productManager = new ProductManager(productsPath);

    if (productManager.getProducts().some((product) => product.id === pId)) {
      const remainingProductsCount = productManager.deleteProduct(pId);
      requestedProducts.status = "success";
      requestedProducts.deleteCount = 1;
      requestedProducts.deletedProductId = pId;
    } else {
      requestedProducts.status = "fail";
      requestedProducts.message = `Product ${pid} wasn't found.`;
    }
  }
  res.status(returnStatus).json(requestedProducts).end();
});

export default ProductsRouter;