export default class Product {
    /**
     * @param {String} title
     * @param {String} description
     * @param {Number} price - Greater or equal to 0.
     * @param {String} thumbnail - Product URL image.
     * @param {String} code - SKU product code (uppercase).
     * @param {Number} stock
     */
    constructor(title, description, price, thumbnail, code, stock) {

        console.log('Please provide the values of:');

        if ((title ?? 'empty') === 'empty') {
            throw new Error('Title:');
        }

        if ((description ?? 'empty') === 'empty') {
            throw new Error('Description: ');
        }

        if ((price ?? 'empty') === 'empty') {
            throw new Error('Price: ');
        }

        if (price < 0) {
            throw new RangeError('Try again, price value must be greater or equal to 0: ');
        }

        if ((thumbnail ?? 'empty') === 'empty') {
            throw new Error('Thumbnail: ');
        }

        if ((code ?? 'empty') === 'empty') {
            throw new Error('SKU code: ');
        }

        if ((stock ?? 'empty') === 'empty') {
            throw new Error('Stock: ');
        }

        if (stock < 0) {
            throw new Error('Try again, stock value must be greater or equal to 0: ');
        }

        this.title = title.trim();
        this.description = description.trim();
        this.price = price;
        this.thumbnail = thumbnail.trim();
        this.code = code.trim().toUpperCase();
        this.stock = stock;
    }
}