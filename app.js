import Product from "./src/product.js";
import ProductManager from "./src/productManager.js";

//! Prueba 1: Crear instancia de la clase “ProductManager”
console.log('---Prueba 1---');
const productManager = new ProductManager();
if (productManager) {
  console.log('Prueba 1, realizada con éxito');
}

//! Prueba 2: Recién creada la instancia llamar a “getProducts” y asi devolver un arreglo vació.
console.log('---Prueba 1---');
console.log('Prueba 2, realizada con éxito, arreglo vació:', productManager.getProducts());

/*
! Prueba 3 + 4: Llamar addProduct() con los siguientes campos:
title: “producto prueba”
description: ”Este es un producto prueba”
price: 200,
thumbnail: ”Sin imagen”
code: ”abc123”,
stock: 25
! El objeto se debe agregar satisfactoriamente con id generado automáticamente sin repetirse
*/
console.log('---Prueba 3 + 4---');
console.log(
  'Producto de prueba generado con el id: ',
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

//! Prueba 5: Llamar a “getProducts” nuevamente, esta vez se debería ver el producto agregado anteriormente
console.log('---Prueba 5---');
console.log('Producto prueba agregado anteriormente:', productManager.getProducts());

//! Prueba 6: Llamar a “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
console.log('---Prueba 6---');
console.log('Producto con id 1:', productManager.getProductById(1));
try {
  let idPrueba = 2;
  console.log('Producto con id 2', productManager.getProductById(idPrueba));
} catch(err) {
  console.error(err);
}

//! Prueba 7: Llamar al método “updateProduct” y cambiar un campo de algún producto, no se debe eliminar el id
console.log('---Prueba 7---');
try {
  const updatedProduct = new Product(
    'Producto actualizado',
    'Esto es una prueba',
    111,
    'Imagen no disponible',
    'aaa111',
    11
  );
  if (productManager.updateProduct(1, updatedProduct)) {
    console.log('El producto se ha actualizado y el id no se ha modificado');
    console.log('Producto actualizado: ', productManager.getProductById(1));
  }
} catch (err) {
  console.error(err);
}

//! Prueba 8: Llamar al método “deleteProduct” y que se elimine correctamente el producto, si no existe arrojar un error.
console.log('---Prueba 7---');
try {
  productManager.deleteProduct(1);
  console.log('El producto con id 1 se ha eliminado');
  console.log('Arreglo vació: ' + productManager.getProducts())
  console.log('Si lo eliminamos por segunda vez presenciamos un error', productManager.deleteProduct(1));
} catch (err) {
  console.error(err);
}