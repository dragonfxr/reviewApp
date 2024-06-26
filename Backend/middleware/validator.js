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

exports.validatePassword = [check('newPassword').trim().not().isEmpty().withMessage('Password is missing.').isLength({ min:6, max:20}).withMessage(
    'Password must be 6-20 characters long.'),];

exports.validate = (req, res, next) => {
    const error = validationResult(req).array();
    if (error.length) {
        return res.json({error: error[0].msg})
    }
    next();
};