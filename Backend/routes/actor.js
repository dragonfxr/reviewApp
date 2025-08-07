const express = require("express");
const { create, update } = require("../controllers/actor");
const { uploadImage } = require("../middleware/multer");
const { actorInfoValidator, validate } = require("../middleware/validator");

const router = express.Router();

router.post(
    '/create', 
    uploadImage.single('avatar'), 
    actorInfoValidator,
    validate,
    create
);

router.post(
    '/update/:id', 
    uploadImage.single('avatar'), 
    actorInfoValidator,
    validate,
    update
);

module.exports = router;