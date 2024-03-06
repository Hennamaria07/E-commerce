const express = require("express");
const cors = require('cors');
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors(
    {
        origin: true,
        credentials: true
    }
));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());

// routes
const userRouter = require('./routes/user.routes.js');
const categoryRouter = require("./routes/category.routes.js");
const productRouter = require("./routes/product.routes.js")
const orderRouter = require("./routes/order.router.js")

app.use('/api/v1/user', userRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/product', productRouter)
app.use('/api/v1/order', orderRouter)

module.exports = app;