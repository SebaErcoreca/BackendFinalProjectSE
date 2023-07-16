import Product from "./product.js";
import { writeFileSync, readFileSync, existsSync } from 'fs';

export default class ProductManager {
    static #lastProductId;
    static #defaultPersistFilePath = './productManager.json';
    static #persistFileOptions = { encoding: 'utf-8' };

    #products = [];

    constructor(persistFilePath) {
        this.path = (persistFilePath ?? ProductManager.#defaultPersistFilePath);
        this.#init();
    }

    /**
     *Add a product to the product collection checking for no repeated code parameter. 
     *If added successfully, the product is assigned an id.
     */
    addProduct = (product) => {
        if (!this.#products.some(p => p.code === product.code)) {

            product.id = ProductManager.#getNewProductId();

            this.#products.push(product);

            this.#persist();

            return product.id;
        }

        throw new Error(`${product.code} already exists.`);
    }

    /**
     * Updates a product identified by it's id checking for the products existence in the ProductManager instance.  
     */
    updateProduct = (productId, updatedProduct) => {
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
    }

    /**
     * Deletes a product identified by its id checking if exists in the ProductManager instance. 
     * It returns the amount of products left in the collection after deleting the product.
     */
    deleteProduct = (productId) => {
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
    }

    /* Returns the product collection */
    getProducts = () => {
        return this.#products;
    }

    /**
     * Looks by the parameter id for a specific product, if found returns the product, else undefined. 
     */
    getProductById = (productId) => {
        const productSearch = this.#products.find(product => product.id === productId);

        if (productSearch) return productSearch;

        throw new Error(`Product with id ${productId} was not found.`);
    }

    /**
    * Looks by the parameter code for a specific product, if found returns the product, else undefined. 
    */
    getProductByCode = (productCode) => {
        const productSearch = this.#products.find(product => product.code === productCode.trim().toUpperCase());

        if (productSearch) return productSearch;

        throw new Error(`Product with code ${productCode} was not found.`);
    }

    /**
     * Returns the path where the path of ProductManager.json in the current instance.
     */
    getPersistPath = () => this.path;

    /**
     * Initializes the current ProductManager Instance.
     * If the persistence file exists and contains products they
     * will be loaded in the lastProductId value.
     */
    #init = () => {
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
                    product.code
                );

                managedProduct.id = product.id;

                return managedProduct;
            }));
        } else {
            ProductManager.#lastProductId = 0;
        }
    }

    #setProducts = (products) => {
        this.#products = [...products];

        return this.#products.length;
    }

    /**
     * Returns a stringified object that contains the lasProductId and the products collection.
     */
    #getPersistObject = () => {
        const persistObject = {};
        persistObject.lastProductId = ProductManager.getLastProductId();
        persistObject.products = this.getProducts();

        return JSON.stringify(persistObject);
    }

    /**
     * Saves the products array and the last product Id assigned.
     */
    #persist = () => {
        writeFileSync(this.getPersistPath(), this.#getPersistObject(), ProductManager.#persistFileOptions);
    }

    static getLastProductId = () => {
        return ProductManager.#lastProductId;
    }

    /**
     * Increments the lastProductId and returns the new value.
     */
    static #getNewProductId = () => {
        return ++ProductManager.#lastProductId;
    }

    /**
     * Sets a new value for the lastProductId.
     */
    static #setLastProductId = (value) => {
        if (value && value >= 0) {
            ProductManager.#lastProductId = value;
            return ProductManager.#lastProductId;
        }
        return 0;
    }
}