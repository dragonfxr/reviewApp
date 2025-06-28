const { check, validationResult } = require("express-validator");

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

exports.validate = (req, res, next) => {
    const error = validationResult(req).array();
    if (error.length) {
        return res.json({error: error[0].msg})
    }
    next();
};