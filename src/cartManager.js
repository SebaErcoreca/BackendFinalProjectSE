import Cart from "./cart.js";
import { writeFileSync, readFileSync, existsSync } from "fs";

export default class CartManager {
  static #lastCartId;
  static #defaultPersistentFilePath = "./CartManager.json";
  static #persistentFileOptions = { encoding: "utf-8" };

  #carts;
  #path = "";

  /* 
  Creates a new CartManager instance.
  */
  constructor(filePath = null) {
    this.#path = filePath ?? CartManager.#defaultPersistentFilePath;
    this.#init();
  }

  /* 
  Returns the current number of products.js in CartManager
  */
  get count() {
    return this.#carts.length;
  }

  /* 
  Returns the last cart id created by the CartManager
  */
  get lastCartId() {
    return CartManager.#lastCartId;
  }
  /* 
  Returns the next cart id created by the CartManager
  */
  get nextCartId() {
    return CartManager.#lastCartId + 1;
  }

  get path() {
    return this.#path;
  }

  getCarts = (limit = 0, offset = 0) => {
    if (limit < 0 || offset < 0) return [];

    if (limit > 0) {
      return this.#carts.slice(offset, offset + limit);
    }
    return this.#carts.slice(offset);
  };

  getCartById = (id) => this.#carts.find((cart) => cart.id === id);


  addCart = (cart) => {
    const newCartId = CartManager.#generateNexCartId();

    const managedCart = {
      ...cart,
      manager: this,
    };

    managedCart.id = newCartId;

    this.#carts.push(managedCart);

    this.#persist();

    return managedCart.id;
  };

  updateCart = (id, cart) => {
    const cartQuery = this.#carts.find(
      (existingCart) => existingCart.id === id
    );

    if (cartQuery) {
      const originalId = cartQuery.id;
      cartQuery = { ...cart, id: originalId };
    }

    throw new Error(`Product ${id} is not in Cart.`);
  };

  deleteCart = (id) => {
    const existsCart = this.#carts.some((cart) => cart.id === id);

    if (existsCart) {
      this.#carts = this.#carts.find((cart) => cart.id !== id);
      return true;
    }

    return false;
  };

  save = () => this.#persist();

  #init = () => {
    if (existsSync(this.#path)) {
      const fileReader = readFileSync(
        this.#path,
        CartManager.#persistentFileOptions
      );

      const persistedCartManager = JSON.parse(fileReader);

      CartManager.#lastCartId = persistedCartManager.lastCartId;

      this.#carts = persistedCartManager.carts.map((cart) => {
        const newCart = new Cart();
      });
    } else {
      CartManager.#lastCartId = 0;
      this.#carts = [];
    }
  };

  getPersistObject = () => {
    const persistObject = {};

    persistObject.lastCartId = CartManager.#lastCartId;

    persistObject.carts = this.#carts.map((cart) => cart.getPersistObject());

    return persistObject;
  };

  #persist = () => {
    writeFileSync(
      this.#path,
      JSON.stringify(this.getPersistObject()),
      CartManager.#persistentFileOptions
    );
  };

  static #generateNexCartId = () => ++CartManager.#lastCartId;
}