const authController = require("../controllers/authController")
const cryptoController = require("../controllers/cryptoController")
const homeController = require("../controllers/homeController")
const { guestOnly } = require("../middleware/guars")

module.exports = app => {
    app.use('/', homeController)
    app.use('/auth', guestOnly(), authController)
    app.use('/crypto', cryptoController)
    app.all('/*', (req, res) => {
        res.render('404')
    })
}