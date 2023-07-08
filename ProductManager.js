class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        if ((title ?? 'empty') === 'empty') {
            throw new Error('Please provide a value for "title".');
        }

        if ((description ?? 'empty') === 'empty') {
            throw new Error('Please provide a value for "description".');
        }

        if ((price ?? 'empty') === 'empty') {
            throw new Error('Please provide a value for "price".');
        }

        if (price < 0) {
            throw new RangeError('"Price" must have a value equal or greater to 0 (zero).');
        }

        if ((thumbnail ?? 'empty') === 'empty') {
            throw new Error('Please provide a value for "thumbnail".');
        }

        if ((code ?? 'empty') === 'empty') {
            throw new Error('Please provide a value for "code".');
        }

        if ((stock ?? 'empty') === 'empty') {
            throw new Error('Please provide a value for "stock".');
        }

        if (stock < 0) {
            throw new Error('"Stock" must have a value equal or greater to 0 (zero).');
        }

        this.title = title.trim();
        this.description = description.trim();
        this.price = price;
        this.thumbnail = thumbnail.trim();
        this.code = code.trim().toUpperCase();
        this.stock = stock;
    }
};

class ProductManager {
    static #lastProductId;

    #products = [];

    constructor() {
    }

    addProduct = (product) => {
        if (!this.#products.some(p => p.code === product.code)) {
            product.id = ProductManager.#getLastProductId();

            this.#products.push(product);
            return product.id;
        }

        throw new Error(`There is already a product with code ${product.code}.`);
    }

    getProducts = () => {
        return this.#products;
    }

    getProductById = (productId) => {
        const foundProduct = this.#products.find(product => product.id === productId);

        if (foundProduct) return foundProduct;

        throw new Error(`Product with id ${productId} was not found.`);
    }

    getProductByCode = (productCode) => {
        const foundProduct = this.#products.find(product => product.code === productCode.trim().toUpperCase());

        if (foundProduct) return foundProduct;

        throw new Error(`Product with code ${productCode} was not found.`);
    }

    static peekNextId = () => {
        if (!ProductManager.#lastProductId) {
            return 1;
        }

        return ProductManager.#lastProductId + 1;
    }

    static #getLastProductId = () => {
        if (!ProductManager.#lastProductId) {
            ProductManager.#lastProductId = 0;
        }

        return ++ProductManager.#lastProductId;
    }
}

const productManager = new ProductManager();
if (productManager) {
    console.log('New ProductManager instance has been created.');
}

console.log('getProducts()', productManager.getProducts());

console.log('addProduct()',
    productManager.addProduct(
        new Product(
            "producto prueba",
            "Este es un producto prueba",
            200,
            "Sin imagen",
            "abc123",
            25
        )
    )
);

console.log('getProducts()', productManager.getProducts());

try {
    console.log('addProduct()',
        productManager.addProduct(
            new Product(
                "producto prueba",
                "Este es un producto prueba",
                200,
                "Sin imagen",
                "abc123",
                25
            )
        )
    );
} catch (err) {
    console.error(err);
}

try {
    console.log('getProductById(1)', productManager.getProductById(1));
    console.log('getProductById(100)', productManager.getProductById(100));  // Return Error
} catch (err) {
    console.error(err);
}