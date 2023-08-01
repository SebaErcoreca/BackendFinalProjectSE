import Product from "./product.js"
import { writeFileSync, readFileSync, existsSync } from 'fs'

export default class ProductManager {
    static #lastProductId
    static #defaultPersistFilePath = '../ProductManager.json'
    static #persistFileOptions = { encoding: 'utf-8' }

    #products = []

    constructor(persistFilePath) {
        this.path = (persistFilePath ?? ProductManager.#defaultPersistFilePath)
        this.#init()
    }

    /* Returns the amount of products in the ProductManager instance. */
    get count() {
        return this.#products.length
    }

    /* Returns the nextProductId */
    get nextProductId() {
        return ProductManager.getLastProductId + 1
    }

    /* Add a product to the product collection, if the code is unique, the product is assigned an id. */
    addProduct = (newProduct) => {
        if (!this.#products.some(product => product.code === newProduct.code)) {
            newProduct.id = ProductManager.#getNewProductId()
            this.#products.push(newProduct)
            this.#persist()
            return newProduct.id
        }
        throw new Error(`${newProduct.code} already exists.`)
    }

    /* If a product exists on the Product Manager instance, update it.*/
    updateProduct = (productId, updatedProduct) => {
        const productIndex = this.#products.findIndex(product => product.id === productId)

        if (productIndex !== -1) {
            const newProduct = new Product(
                updatedProduct.title,
                updatedProduct.description,
                updatedProduct.price,
                updatedProduct.thumbnail,
                updatedProduct.code,
                updatedProduct.stock
            )

            newProduct.id = productId

            this.#products = [
                ...this.#products.slice(0, productIndex),
                newProduct,
                ...this.#products.slice(productIndex + 1)
            ]

            this.#persist()

            return true
        } else {
            throw new Error(`Couldn't update. Product with id: ${productId} was not found.`)
        }
    }

    /* If product is identified by its id, delete it.*/
    deleteProduct = (productId) => {
        const productIndex = this.#products.findIndex(product => product.id === productId)

        if (productIndex !== -1) {
            this.#products = [
                ...this.#products.slice(0, productIndex),
                ...this.#products.slice(productIndex + 1)
            ]

            this.#persist()

            return this.#products.length
        } else {
            throw new Error(`Couldn't delete the product. Product with id ${productId} was not found.`)
        }
    }

    /* Erases all products in the instance and restarts the lastProductsId = 0. */
    resetProductsId = () => {
        this.#products = []
        ProductManager.#lastProductId = 0
        this.#persist()
    }

    /* Returns the product collection. */
    getProducts = () => {
        return this.#products
    }

    /* Find the product given its id, if found return the product, else undefined. */
    getProductById = (productId) => {
        const productSearch = this.#products.find(product => product.id === productId)

        if (productSearch) return productSearch

        throw new Error(`Product with id ${productId} was not found.`)
    }

    /* Find the product given its code, if found return the product, else undefined. */
    getProductByCode = (productCode) => {
        const productSearch = this.#products.find(product => product.code === productCode.trim().toUpperCase())

        if (productSearch) return productSearch

        throw new Error(`Product with code ${productCode} was not found.`)
    }

    /*     Returns the path where the path of ProductManager.json in the current instance. */
    getPersistPath = () => this.path

    /*
    Initializes the current ProductManager Instance. If the persistence file exists and contains 
    products they will be loaded in the lastProductId value.
     */
    #init = () => {
        if (existsSync(this.getPersistPath())) {
            const fileReader = readFileSync(this.getPersistPath(), ProductManager.#persistFileOptions)
            const persistedProductManager = JSON.parse(fileReader)

            ProductManager.#setLastProductId(persistedProductManager.lastProductId)

            this.#setProducts(persistedProductManager.products.map(product => {
                const managedProduct = new Product(
                    product.title,
                    product.description,
                    product.price,
                    product.thumbnail,
                    product.code,
                    product.stock
                )

                managedProduct.id = product.id

                return managedProduct
            }))
        } else {
            ProductManager.#lastProductId = 0
        }
    }

    #setProducts = (products) => {
        this.#products = [...products]

        return this.#products.length
    }

    /* Returns a stringified object that contains the lasProductId and the products collection. */
    #getPersistObject = () => {
        const persistObject = {}
        persistObject.lastProductId = ProductManager.getLastProductId()
        persistObject.products = this.getProducts()

        return JSON.stringify(persistObject)
    }

    /* Saves the products array and the last product Id assigned. */
    #persist = () => {
        writeFileSync(this.getPersistPath(), this.#getPersistObject(), ProductManager.#persistFileOptions)
    }

    static getLastProductId = () => {
        return ProductManager.#lastProductId
    }

    /* Increments the lastProductId and returns the new value. */
    static #getNewProductId = () => {
        return ++ProductManager.#lastProductId
    }

    /* Sets a new value for the lastProductId. */
    static #setLastProductId = (value) => {
        if (value && value >= 0) {
            ProductManager.#lastProductId = value
            return ProductManager.#lastProductId
        }
        return 0
    }
}