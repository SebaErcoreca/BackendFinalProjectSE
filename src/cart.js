import CartItem from "./cartItem.js";
import CartManager from "./cartManager.js";

export default class Cart {
  #items = [];
  #modifiedOn;
  manager;

  constructor() {
    const creationDate = new Date(Date.now());
    this.#items = [];
    this.createdOn = creationDate;
    this.#modifiedOn = creationDate;
  }

  get count() {
    return this.#items.reduce((total, current) => (total += current.quantity), 0);
  }

  get modifiedOn() {
    return this.#modifiedOn;
  }

  getPersistObject = () => {
    const persistObject = {};
    persistObject.id = this.id;
    persistObject.createdOn = this.createdOn;
    persistObject.modifiedOn = this.modifiedOn;
    persistObject.items = this.#items.map((item) => item.persistObject());

    return persistObject;
  };

  set manager(object) {
    this.manager = new CartManager(object.path);
  }

  addItem = (item, quantity = 1, increaseOnDuplicateCode = true) => {
    const itemAlreadyExists = this.#items.some(
      (existingItem) => existingItem.productId === item.productId
    );

    if (itemAlreadyExists) {
      if (increaseOnDuplicateCode) {
        const currentItem = this.#items.find(
          (existingItem) => existingItem.productId === item.productId
        );
        currentItem.quantity += quantity;
        const persistObject = this.manager.save();
      } else {
        throw new Error(
          `Item with code ${item.code} already exists in the Cart.`
        );
      }
    } else {
      item.quantity = quantity;
      this.#items.push(item);
    }
    return this.count;
  };

  getItems = () => this.#items;
  getItemById = (id) => this.#items.find((item) => item.id === id);

  static parse = (object) => {
    const newCart = new Cart();
    newCart.id = object.id;
    newCart.createdOn = object.createdOn;
    newCart.#modifiedOn = object.modifiedOn;
    if (object.items) {
      newCart.#items = object.items.map(
        (item) => new CartItem(item.productId, item.salesPrice, item.quantity)
      );
    } else {
      newCart.#items = [];
    }
    return newCart;
  };
}