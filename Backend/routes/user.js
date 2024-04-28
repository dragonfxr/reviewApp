const express = require("express");

const { create } = require("../controllers/user");
const { validate, userValidator } = require("../middleware/validator");

const router = express.Router();

router.post("/create", userValidator, validate, create);// check it's not empty, if is empty, send error message

module.exports = router;