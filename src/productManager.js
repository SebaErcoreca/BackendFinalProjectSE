import { writeFileSync, readFileSync, existsSync } from 'fs';

export default class ProductManager {
    static #lastProductId;
    static #defaultPersistFilePath = '../ProductManager.json';
    static #persistFileOptions = { encoding: 'utf-8' };

    #products = [];

    #path = "";

    constructor(persistFilePath) {
        this.#path = (persistFilePath ?? ProductManager.#defaultPersistFilePath);
        this.#init();
    }

    get persistPath() {
        return this.#path;
    }

    /* Returns the amount of products in the ProductManager instance. */
    get count() {
        return this.#products.length;
    }

    /* Returns the nextProductId */
    get nextProductId() {
        return ProductManager.#lastProductId + 1;
    }

    get lastProductId() {
        return ProductManager.#lastProductId;
    }

    /**
     *Add a product to the product collection checking for no repeated code parameter. 
     *If added successfully, the newProduct is assigned an id.
     */
    addProduct = (newProduct) => {
        const existingProduct = this.getProductByCode(newProduct.code);
        if (existingProduct) { throw new Error(`There is already a product with code ${newProduct.code}.`) }
        newProduct.id = ProductManager.#generateNextProductId();
        this.#products.push(newProduct);
        this.#persist();
        return newProduct.id;

        /* if (!this.#products.some(product => product.code === newProduct.code)) {
            newProduct.id = ProductManager.#getNewProductId();
            this.#products.push(newProduct);
            this.#persist();
            return newProduct.id;
        }
        throw new Error(`${newProduct.code} already exists.`); */
    }

    /**
     * Updates a product identified by it's id checking 
     * for the products existence in the ProductManager instance.  
     */
    /* updateProduct = (productId, updatedProduct) => {
        const productIndex = this.#products.findIndex(product => product.id === productId);

        if (productIndex !== -1) {
            const newProduct = new Product(
                updatedProduct.title,
                updatedProduct.description,
                updatedProduct.price,
                updatedProduct.thumbnail,
                updatedProduct.code,
                updatedProduct.stock
            );

            newProduct.id = productId;

            this.#products = [
                ...this.#products.slice(0, productIndex),
                newProduct,
                ...this.#products.slice(productIndex + 1)
            ];

            this.#persist();

            return true;
        } else {
            throw new Error(`Couldn't update. Product with id: ${productId} was not found.`);
        }
    } */

    updateProduct = (productId, updateProduct) => {
        const existingProduct = this.getProductById(productId);
        if (existingProduct) {
            existingProduct.title = updateProduct.title;
            existingProduct.description = updateProduct.description;
            existingProduct.code = updateProduct.code;
            existingProduct.price = updateProduct.price;
            existingProduct.status = updateProduct.status;
            existingProduct.stock = updateProduct.stock;
            existingProduct.category = updateProduct.category;
            existingProduct.thumbnails = updateProduct.thumbnails;
            this.#persist();
            return true;
        } else {
            throw new Error(
                `Product ${productId} wasn't found.`
            );
        }
    };

    /**
     * Deletes a product identified by its id checking if exists in the ProductManager instance. 
     * It returns the amount of products left in the collection after deleting the product.
     */
    /* deleteProduct = (productId) => {
        const productIndex = this.#products.findIndex(product => product.id === productId);

        if (productIndex !== -1) {
            this.#products = [
                ...this.#products.slice(0, productIndex),
                ...this.#products.slice(productIndex + 1)
            ];

            this.#persist();

            return this.#products.length;
        } else {
            throw new Error(`Couldn't delete the product. Product with id ${productId} was not found.`);
        }
    } */

    deleteProduct = (productId) => {
        const existingProduct = this.getProductById(productId);

        if (existingProduct) {
            this.#products = this.#products.filter(
                (product) => product.id !== productId
            );

            this.#persist();
            return this.#products.length;
        } else {
            throw new Error(
                `Product ${productId} wasn't found.`
            );
        }
    };

    /* 
    Erases all products in the instance and 
    restarts the lastProductsId = 0
    */
    /* resetProductsId = () => {
        this.#products = [];
        ProductManager.#lastProductId = 0;
        this.#persist();
    } */

    /* Returns the product collection */
    getProducts = () => {
        return this.#products;
    }

    /**
     * Looks by the parameter id for a specific product, if found returns the product, else undefined. 
     */
    /* getProductById = (productId) => {
        const productSearch = this.#products.find(product => product.id === productId);

        if (productSearch) return productSearch;

        throw new Error(`Product with id ${productId} was not found.`);
    } */

    getProductById = (pId) =>
        this.#products.find((product) => product.id === pId);

    /**
    * Looks by the parameter code for a specific product, if found returns the product, else undefined. 
    */
    /* getProductByCode = (productCode) => {
        const productSearch = this.#products.find(product => product.code === productCode.trim().toUpperCase());

        if (productSearch) return productSearch;

        throw new Error(`Product with code ${productCode} was not found.`);
    } */

    getProductByCode = (pCode) =>
        this.#products.find(
            (product) => product.code === pCode.trim().toUpperCase()
        );

    /**
     * Initializes the current ProductManager Instance.
     * If the persistence file exists and contains products they
     * will be loaded in the lastProductId value.
     */
    /* #init = () => {
        if (existsSync(this.getPersistPath())) {
            const fileReader = readFileSync(this.getPersistPath(), ProductManager.#persistFileOptions);
            const persistedProductManager = JSON.parse(fileReader);

            ProductManager.#setLastProductId(persistedProductManager.lastProductId);

            this.#setProducts(persistedProductManager.products.map(product => {
                const managedProduct = new Product(
                    product.title,
                    product.description,
                    product.price,
                    product.thumbnail,
                    product.code,
                    product.stock
                );

                managedProduct.id = product.id;

                return managedProduct;
            }));
        } else {
            ProductManager.#lastProductId = 0;
        }
    } */

    #init = () => {
        if (existsSync(this.#path)) {
            const fileReader = readFileSync(
                this.#path,
                ProductManager.#persistFileOptions
            );
            const persistedProductManager = JSON.parse(fileReader);

            ProductManager.#lastProductId = persistedProductManager.lastProductId;

            this.#products = persistedProductManager.products;
        } else {
            ProductManager.#lastProductId = 0;
            this.#products = [];
        }
    };

    /**
     * Returns the path where the path of ProductManager.json in the current instance.
     */
    getPersistPath = () => this.path;

    /**
     * Returns a stringified object that contains the lasProductId and the products collection.
     */
    #getPersistObject = () => {
        const persistObject = {};
        persistObject.lastProductId = this.lastProductId;
        persistObject.products = this.#products;
        return JSON.stringify(persistObject);
    }

    /**
     * Saves the products array and the last product Id assigned.
     */
    #persist = () => {
        writeFileSync(
          this.#path,
          this.#getPersistObject(),
          ProductManager.#persistFileOptions
        );
      };

    static getLastProductId = () => {
        return ProductManager.#lastProductId;
    }

    /**
     * Increments the lastProductId and returns the new value.
     */
    static #generateNextProductId = () => {
        return ++ProductManager.#lastProductId;
    }
}