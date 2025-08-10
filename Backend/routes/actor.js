const express = require("express");
const { create, update, remove, search, getLatestActors, getSingleActor } = require("../controllers/actor");
const { uploadImage } = require("../middleware/multer");
const { actorInfoValidator, validate } = require("../middleware/validator");
const { isAuth, isAdmin } = require("../middleware/auth");

const router = express.Router();

router.post(
    '/create', 
    isAuth, 
    isAdmin,
    uploadImage.single('avatar'), 
    actorInfoValidator,
    validate,
    create
);

router.post(
    '/update/:actorId', 
    isAuth, 
    isAdmin,
    uploadImage.single('avatar'), 
    actorInfoValidator,
    validate,
    update
);

router.delete('/:actorId', isAuth, isAdmin, remove);

router.get('/search', isAuth, isAdmin, search);
router.get('/latest-uploads', isAuth, isAdmin, getLatestActors);
router.get('/single/:id', getSingleActor);

module.exports = router;