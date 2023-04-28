const { body, validationResult } = require('express-validator')
const { register, login } = require('../services/authService')
const { parseErrs, parseOtherErrsToExpressValidationErrs } = require('../util/errorParser')

const authController = require('express').Router()

authController.get('/register', (req, res) => {
    res.render('register')
})

authController.post('/register',
    body(['username', 'email', 'password']).trim(),
    body('password').isLength(4).withMessage('The password must be at least 4 characters long!'),
    body('rePassword').custom((value, { req }) => value == req.body.password).withMessage('The passwords don\'t match!'),
    async (req, res) => {
        const { errors } = validationResult(req)
        try {
            if (errors.length > 0) throw errors
            const token = await register(req.body)
            res.cookie('token', token, { maxAge: 14400000 })
            res.redirect('/')
        } catch (error) {
            if (!Array.isArray(error)) errors.push(...parseOtherErrsToExpressValidationErrs(error))
            res.render('register', {
                userData: {
                    username: req.body.username,
                    email: req.body.email,
                },
                errorsObj: parseErrs(errors)
            })
        }
    })

authController.get('/login', (req, res) => {
    res.render('login')
})

authController.post('/login',
    body(['username', 'email', 'password']).trim(),
    async (req, res) => {
        try {
            const token = await login(req.body)
            res.cookie('token', token, { maxAge: 14400000 })
            res.redirect('/')
        } catch (error) {
            res.render('login', {
                userData: {
                    email: req.body.email
                },
                errorsObj: parseErrs(parseOtherErrsToExpressValidationErrs(error))
            })
        }
    })

module.exports = authController