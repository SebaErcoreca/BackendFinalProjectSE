import express from 'express';
import ProductsRouter from './src/routers/products.router.js';
import CartsRouter from './src/routers/carts.router.js';
import { viewsRouter } from './src/routers/views.router.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';

const app = express();

const PORT = 8080;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/public"));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', 'src/views');

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use("/api/products/", ProductsRouter);
app.use("/api/carts/", CartsRouter);
app.use("/", viewsRouter);

const server = app.listen(PORT, () => console.log(`[🐸 Listening on port ${PORT}: http://localhost:${PORT}/ 🐸]`));
app.on("error", (err) => { console.log(err) })

const io = new Server(server)

io.on('connection', (socket) => {
    console.log(`----------->New open connection, id: ${socket.id}`);

    socket.on('disconnect', (socket) => {
        console.log(`----------->Connection lost`);
    })
})