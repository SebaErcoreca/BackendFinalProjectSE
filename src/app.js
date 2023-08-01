import ProductManager from "./productManager.js"
import express from "express"

//Server defined
const app = express()

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))

//ProdManager session initialized
const productManager = new ProductManager()

//Root page
app.get('/', (req, res) => {
  res.send('<h1><a href="/products">Lista de Productos</a></h1>')
})

//Products page
app.get('/products', (req, res) => {
  const responseObject = {}

  const allProducts = productManager.getProducts()

  const { offset, limit } = req.query

  const offsetValue = Number(offset ?? 0)

  //Check if offset is number
  if (isNaN(offsetValue)) {
    responseObject.status = 'error'
    responseObject.error = `Error: '${offset}' is not a valid offset value.`
    res.status(400).json(responseObject).end()
    return
  }
  //Check is offset is a negative number or not an integer
  if (offsetValue < 0 || offsetValue % 1 !== 0) {
    responseObject.status = 'error'
    responseObject.error = `Error: offset parameter must be a non-negative integer.`
    res.status(400).json(responseObject).end()
    return
  }

  const limitValue = Number(limit ?? 0)

  //Check if limit is a number
  if (isNaN(limitValue)) {
    responseObject.status = 'error'
    responseObject.error = `Error: '${limit}' is not a valid limit value.`
    res.status(400).json(responseObject).end()
    return
  }

  /* Check if limit is a negative number or not an integer. */
  if (limitValue < 0 || limitValue % 1 !== 0) {
    responseObject.status = 'error'
    responseObject.error = 'Error: limit parameter must be a non-negative integer.'
    res.status(400).json(responseObject).end()
    return
  }

  /* Checks if offsetValue is less than the current collection of products. */
  if (offsetValue < allProducts.length) {
    const lastIndex = limitValue === 0 ? allProducts.length : Math.min(allProducts.length, (offsetValue + limitValue))
    const filteredProducts = allProducts.slice(offsetValue, lastIndex)
    responseObject.status = 'success'
    responseObject.products = filteredProducts
  } else {
    responseObject.status = 'error'
    responseObject.error = 'Error: offset value out of bounds.'
  }
  res.json(responseObject)
})

/* Returns a product searched by the productId */
app.get('/products/:id', (req, res) => {
  const responseObject = {}
  const productId = Number(req.params.id)

  /* Check if id is a number. */
  if (isNaN(productId)) {
    responseObject.status = 'error'
    responseObject.error = `Error: '${req.params.id}' is not a valid product id.`
    res.status(400).json(responseObject).end()
    return
  }

  try {
    const product = productManager.getProductById(productId)
    responseObject.status = 'success'
    responseObject.product = product
  } catch (err) {
    responseObject.status = 'error'
    responseObject.error = `${err}`
  }

  res.json(responseObject).end()
})

/* Adds a product to the productManager */
app.put('/products', (req, res) => {
  console.log('req.body', req.body)
  res.status(201).end()
})

const PORT = 8080

app.listen(PORT, () =>
  console.log(`[ listening on port ${PORT}: http://localhost:${PORT}/ ]👀 > `))


/*
//! Prueba 1: Crear instancia de la clase “ProductManager”
console.log('---Prueba 1---')
const productManager = new ProductManager()
if (productManager) {
  console.log('Prueba 1, realizada con éxito')
}

//! Prueba 2: Recién creada la instancia llamar a “getProducts” y asi devolver un arreglo vació.
console.log('---Prueba 1---')
console.log('Prueba 2, realizada con éxito, arreglo vació:', productManager.getProducts())

//! Prueba 3 + 4: Llamar addProduct() con los siguientes campos:
title: “producto prueba”
description: ”Este es un producto prueba”
price: 200,
thumbnail: ”Sin imagen”
code: ”abc123”,
stock: 25
//! El objeto se debe agregar satisfactoriamente con id generado automáticamente sin repetirse

console.log('---Prueba 3 + 4---')
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
)

//! Prueba 5: Llamar a “getProducts” nuevamente, esta vez se debería ver el producto agregado anteriormente
console.log('---Prueba 5---')
console.log('Producto prueba agregado anteriormente:', productManager.getProducts())

//! Prueba 6: Llamar a “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
console.log('---Prueba 6---')
console.log('Producto con id 1:', productManager.getProductById(1))
try {
  let idPrueba = 2
  console.log('Producto con id 2', productManager.getProductById(idPrueba))
} catch(err) {
  console.error(err)
}

//! Prueba 7: Llamar al método “updateProduct” y cambiar un campo de algún producto, no se debe eliminar el id
console.log('---Prueba 7---')
try {
  const updatedProduct = new Product(
    'Producto actualizado',
    'Esto es una prueba',
    111,
    'Imagen no disponible',
    'aaa111',
    11
  )
  if (productManager.updateProduct(1, updatedProduct)) {
    console.log('El producto se ha actualizado y el id no se ha modificado')
    console.log('Producto actualizado: ', productManager.getProductById(1))
  }
} catch (err) {
  console.error(err)
}

//! Prueba 8: Llamar al método “deleteProduct” y que se elimine correctamente el producto, si no existe arrojar un error.
console.log('---Prueba 7---')
try {
  productManager.deleteProduct(1)
  console.log('El producto con id 1 se ha eliminado')
  console.log('Arreglo vació: ' + productManager.getProducts())
  console.log('Si lo eliminamos por segunda vez presenciamos un error', productManager.deleteProduct(1))
} catch (err) {
  console.error(err)
} */