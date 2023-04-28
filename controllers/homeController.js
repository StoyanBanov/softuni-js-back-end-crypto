const router = require('express').Router()

router.get('/', (req, res) => {
    res.render('home')
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    res.redirect('/')
})

module.exports = router