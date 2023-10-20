import express from 'express';
import ProductsRouter from './src/routers/products.router.js';
import CartsRouter from './src/routers/carts.router.js';
import { viewsRouter } from './src/routers/views.router.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
//import { userModel } from './src/models/userModel.js';
import { userRouter } from './src/routers/user.router.js'
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';

const app = express()
app.use(express.json())
//app.use(cookieParser())
//app.use(cors())
app.use(fileUpload({
    useTempFiles: true
}))
app.use(express.text())
app.use(express.urlencoded({ extended: true }));

//Routes
//app.use(express.static("src/public"));
app.use('/user', userRouter)
app.use("/api/products/", ProductsRouter);
app.use("/api/carts/", CartsRouter);
app.use("/", viewsRouter);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', 'src/views');

app.use((req, res, next) => {
    req.io = io;
    next();
});

//Mongo connection
const mongoURI = process.env.MONGO_URL
const connectToMongoDB = async () => {
    try {
        mongoose.set("strictQuery", false)
        mongoose.connect(mongoURI)
        console.log("Connected to MongoDB successfully.")
        /* mongoose.connect(URI, {
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, err => {
            if (err) throw err;
            console.log.apply('Connected to MongoDB')
        }) */
    } catch (error) {
        console.error(error);
    }
}

//Welcome
app.get('/', (req, res) => {
    res.json({ msg: "Welcome!" })
})

//Server
const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => console.log(`[🐸 Listening on port ${PORT}: http://localhost:${PORT}/ 🐸]`));
app.on("error", (err) => { console.log(err) })

const io = new Server(server)

io.on('connection', (socket) => {
    console.log(`----------->New open connection, id: ${socket.id}`);

    socket.on('disconnect', (socket) => {
        console.log(`----------->Connection lost`);
    })
})