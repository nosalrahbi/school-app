const { check, validationResult } = require('express-validator');


module.exports = {
    validateUser: [
        check('username')
            .trim()
            .escape()
            .isLength({ min:5 }).withMessage('Username should be at least 5 characters lengtا')
            .isAlphanumeric().withMessage('Login must be alphanumeric'),
        check('email')
            .isEmail().withMessage('Must be valid email')
            .normalizeEmail(),
        check('password')
            .isLength({ min:8 }).withMessage('Password must be at least 8 characters in length')
            .matches('\[0-9\]').withMessage('Password must contain at least 1 number')
            .matches('\[a-z\]').withMessage('Password must contain at least 1 lowercase letter')
            .matches('\[A-Z\]').withMessage('Password must contain at least 1 UPPERCASE letter')
            .custom((value, {req, loc, path}) => {
                if (value !== req.body.password2) {
                    return false;
                } else {
                    return value;
                }
            }).withMessage("Passwords don't match"),
    ],
    validateLogin: [
        check('username')
            .trim()
            .escape(),
        check('password')
            .trim(),
    ],
    errorFormatter: ({location, msg, param, value, nestedErrors}) => {
            return {
                type: "Error",
                name: "Signup Failure",
                location: location,
                message: msg,
                param: param,
                value: value,
                nestedErrors: nestedErrors,
            }
    }
}