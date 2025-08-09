const express = require("express");
require('express-async-errors');
const morgan = require("morgan");
const cors = require('cors');
const { errorHandler } = require("./middleware/error");
require('dotenv').config();//这个必须在helper.js（下面）之前加载，否则helper里用用到环境变量，就加载不到了
const { handleNotFound } = require("./utils/helper");
require("./db/index");//mongoose uri
const userRouter = require("./routes/user");//.js
const actorRouter = require("./routes/actor");//.js

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/user', userRouter);
app.use('/api/actor', actorRouter);

app.use('/*', handleNotFound);

app.use(errorHandler);

// error handling
app.use((err, req, res, next) => {
    res.status(500).json({error : err.message || err });
});

// MVC

app.listen(8000, () => {
    console.log("the port is listening on port 8000");
});
