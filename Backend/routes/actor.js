const express = require("express");
const { create, update, remove, search, getLatestActors, getSingleActor } = require("../controllers/actor");
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
    '/update/:actorId', 
    uploadImage.single('avatar'), 
    actorInfoValidator,
    validate,
    update
);

router.delete('/:actorId', remove);

router.get('/search', search);
router.get('/latest-uploads', getLatestActors);
router.get('/single/:id', getSingleActor);

module.exports = router;