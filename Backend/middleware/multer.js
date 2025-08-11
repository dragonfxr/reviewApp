//Multer 是 Node.js 里专门用来处理文件上传（尤其是 multipart/form-data 表单数据）的中间件。

//在 Express 应用里，普通的 req.body 只能拿到非文件字段（比如文本、数字），但遇到上传文件时，Express 本身并不会帮你解析文件内容，这时候就需要 Multer 来处理。
const multer = require('multer');
const storage = multer.diskStorage({});


//找到字段名是 "video" 的文件（<input type="file" name="video">）
//把它解析成 req.file（当前文件对象）和 req.body（其他字段）。
//Multer 会单独处理文件字段，把它解析成一个对象放在 req.file（单文件）或 req.files（多文件）里，而不是 req.body。
//req.body 只会保留非文件字段（name、about、gender 这种）。
const imageFilter = (req, file, callback) => {
    if(!file.mimetype.startsWith('image')){
        callback('Only image files!', false);
    }
    callback(null, true);
};

const videoFilter = (req, file, callback) => {
    if(!file.mimetype.startsWith('video')){
        callback('Only video files!', false);
    }
    callback(null, true);
};

exports.uploadImage = multer({ storage, fileFilter: imageFilter });
exports.uploadVideo = multer({ storage, fileFilter: videoFilter });