const express = require("express");
const userRouter = require("./routes/user");//.js

const app = express();
app.use(userRouter);

// MVC

app.listen(8000, () => {
    console.log("the port is listening on port 8000");
});