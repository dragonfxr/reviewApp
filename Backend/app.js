const express = require("express");
require('express-async-errors');
const morgan = require("morgan");
const { errorHandler } = require("./middleware/error");
require('dotenv').config();
require("./db/index");//mongoose uri
const userRouter = require("./routes/user");//.js

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/user', userRouter);

app.use(errorHandler);

// error handling
app.use((err, req, res, next) => {
    res.status(500).json({error : err.message || err });
});

// MVC

app.listen(8000, () => {
    console.log("the port is listening on port 8000");
});
