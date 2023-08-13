export default class CartItem {

    constructor(id, price, quantity = 1) {
      this.id = id;
      this.price = price;
      this.quantity = quantity;
    }
  
    getPersistObject = () => {
      const persistObject = {};
      persistObject.id = this.id;
      persistObject.price = this.price;
      persistObject.quantity = this.quantity;
  
      return this.persistObject;
    }
  
    static parse = (object) => {
      const newCartItem = new CartItem(
        object.id,
        object.price,
        object.quantity
      );
  
      return newCartItem;
    };
  }
  