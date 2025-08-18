const express = require("express");
const { create, update, remove, search, getLatestActors, getSingleActor } = require("../controllers/actor");
const { uploadVideo, uploadImage } = require("../middleware/multer");
const { actorInfoValidator, validate, validateMovie } = require("../middleware/validator");
const { isAuth, isAdmin } = require("../middleware/auth");
const { uploadTrailer, createMovie } = require("../controllers/movie");
const { parseData } = require("../utils/helper");

const router = express.Router();

//找到字段名是 "video" 的文件（<input type="file" name="video">）。

//把它解析成 req.file（当前文件对象）和 req.body（其他字段）。
router.post('/upload-trailer', isAuth, isAdmin, uploadVideo.single('video'), uploadTrailer);//只接收 name="video" 这个字段里上传的一个文件，并帮我处理好它（保存、解析等）
router.post('/create', isAuth, isAdmin, uploadImage.single('poster'), parseData, 
    validateMovie, validate, 
    createMovie);

module.exports = router;