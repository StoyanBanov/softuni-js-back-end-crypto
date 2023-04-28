const { urlencoded, static } = require('express')
const cookieParser = require('cookie-parser')
const nav = require('../middleware/nav')
const auth = require('../middleware/auth')
const hbs = require('express-handlebars').create({
    extname: '.hbs'
})

module.exports = app => {
    app.engine('.hbs', hbs.engine)
    app.set('view engine', '.hbs')
    app.use('/static', static('static'))
    app.use(urlencoded({ extended: true }))
    app.use(cookieParser())
    app.use(auth())
    app.use(nav())
}