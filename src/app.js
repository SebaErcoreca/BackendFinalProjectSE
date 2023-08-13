import express from 'express';
import ProductsRouter from "./routes/products.router.js";
import CartsRouter from "./routes/carts.router.js";

/* const { pathname: root } = new URL("./public", import.meta.url);
console.info("Public folder path ", root); */

const PORT = 8080;

const app = express();
app.use("/public", express.static("./public"));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products/", ProductsRouter);
app.use("/api/carts/", CartsRouter);

app.listen(PORT, () => console.log(`[Listening on port ${PORT}: http://localhost:${PORT}/ 👀]`));