const express = require("express");
const userRouter = require("./routes/user");//.js
require("./db/index");

const app = express();
app.use(express.json());
app.use('/api/user', userRouter);

// MVC

app.listen(8000, () => {
    console.log("the port is listening on port 8000");
});
