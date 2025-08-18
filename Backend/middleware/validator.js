const { check, validationResult } = require("express-validator");
const genres = require('../utils/genres');
const { isValidObjectId } = require("mongoose");

exports.userValidator = [// no need to next(), because already handled the error.
    check('name').trim().not().isEmpty().withMessage('Name is missing.'),
    check('email').normalizeEmail().isEmail().withMessage('Email is invalid.'),
    check('password').trim().not().isEmpty().withMessage('Password is missing.').isLength({ min:6, max:20}).withMessage(
        'Password must be 6-20 characters long.'
    ),
];

exports.signInValidator = [// no need to next(), because already handled the error.
    check('email').normalizeEmail().isEmail().withMessage('Email is invalid.'),
    check('password').trim().not().isEmpty().withMessage('Password is missing.'),
];

//从请求体中取出字段名为 "newPassword" 的值来进行验证（验证 req.body.newPassword 这个字段的值）。
//如果 .not().isEmpty() 验证失败，就用这个自定义错误信息返回给用户。
//检查 newPassword 的长度。如果长度不符合要求，就返回这个错误信息。
exports.validatePassword = [check('newPassword').trim().not().isEmpty().withMessage('Password is missing.').isLength({ min:6, max:20}).withMessage(
    'Password must be 6-20 characters long.'),];

exports.actorInfoValidator = [
    check('name').trim().not().isEmpty().withMessage('The actor name is missing.'),
    check('about').trim().not().isEmpty().withMessage('About is required.'),
    check('gender').trim().not().isEmpty().withMessage('Gender is required.'),
];

exports.validateMovie = [
  check("title").trim().not().isEmpty().withMessage("Movie title is missing!"),
  check("storyLine")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Storyline is important!"),
  check("language").trim().not().isEmpty().withMessage("Language is missing!"),
  check("releaseDate").isDate().withMessage("Release date is missing!"),
  check("status")
    .isIn(["public", "private"])
    .withMessage("Movie status must be public or private!"),
  check("type").trim().not().isEmpty().withMessage("Movie type is missing!"),
  check("genres")//check("genres") 会先去取 req.body.genres, 然后把这个值直接作为第一个参数传给 .custom() 回调
                //(value)，只是给这个参数起了个名字，不是要求 genres 里面一定有个叫 "value" 的键
    .isArray()
    .withMessage("Genres must be an array of strings!")
    .custom((value) => {
      for (let g of value) {
        if (!genres.includes(g)) throw Error("Invalid genres!");
      }
      return true;
    }),
  check("tags")
    .isArray({ min: 1 })
    .withMessage("Tags must be an array of strings!")
    .custom((tags) => {
      for (let tag of tags) {
        if (typeof tag !== "string")
          throw Error("Tags must be an array of strings!");
      }
      return true;
    }),
  check("cast")
    .isArray()
    .withMessage("Cast must be an array of objects!")
    .custom((cast) => {
      for (let c of cast) {
        if (!isValidObjectId(c.actor)) throw Error("Invalid cast id inside cast!");
        if (!c.roleAs?.trim()) throw Error("Role as is missing inside cast!");
        if (typeof c.leadActor !== "boolean")
          throw Error(
            "Only accepted boolean value inside leadActor inside cast!"
          );
        }
      return true;
    }),
  check("trailer")
    .isObject()
    .withMessage("trailer must be an object with url and public_id")
    .custom((trailer) => {// trailer这个对象里面有url， public_id两个字段，拿出来处理
      const { url, public_id } = trailer;
      try {
        const result = new URL(url);
        if (!result.protocol.includes("http"))
          throw Error("Trailer url is invalid!");

        const arr = url.split("/");
        const publicId = arr[arr.length - 1].split(".")[0];

        if (public_id !== publicId)
          throw Error("Trailer public_id is invalid!");
        return true;
      } catch (error) {
        throw Error("Trailer url is invalid!");
      }
    }),
  check("poster").custom((_, { req }) => {
    if (!req.file) throw Error("Poster file is missing!");
    return true;
  }),
];

exports.validate = (req, res, next) => {
    const error = validationResult(req).array();
    if (error.length) {
        return res.json({error: error[0].msg})
    }
    next();
};

