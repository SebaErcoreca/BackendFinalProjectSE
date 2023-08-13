export default class Product {
    /**
     * @param {String} title
     * @param {String} description
     * @param {Number} price - Greater or equal to 0.
     * @param {String} thumbnail - Product URL image.
     * @param {String} code - SKU product code (uppercase).
     * @param {Number} stock
     * @param {Boolean} status - Product status
     * @param {String} category - Product category
     */
    constructor(title, description, price, thumbnail, code, stock, status = true, category) {

        if ((title ?? 'empty') === 'empty') {
            throw new Error('Title field is required.');
        }

        if ((description ?? 'empty') === 'empty') {
            throw new Error('Description field is required.');
        }

        if ((price ?? 'empty') === 'empty') {
            throw new Error('Price field is required.');
        }

        if (price < 0) {
            throw new RangeError('Price value must be greater or equal to 0.');
        }

        if ((thumbnail ?? 'empty') === 'empty') {
            throw new Error('Thumbnail field is required.');
        }

        if ((code ?? 'empty') === 'empty') {
            throw new Error('Code field is required.');
        }

        if ((stock ?? 'empty') === 'empty') {
            throw new Error('Stock field is required.');
        }

        if (stock < 0) {
            throw new Error('Stock value must be greater or equal to 0: ');
        }

        if ((category ?? "empty") === "empty"){
            throw new Error('Category field is required.')
        }

        this.title = title.trim();
        this.description = description.trim();
        this.price = price;
        this.thumbnail = thumbnail.trim();
        this.code = code.trim().toUpperCase();
        this.stock = stock;
        this.category = category;
        this.status = status;
    }
}