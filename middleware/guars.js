function userOnly() {
    return (req, res, next) => {
        if (req.user) next()
        else res.redirect('/auth/login')
    }
}

function guestOnly() {
    return (req, res, next) => {
        if (req.user) res.redirect('/')
        else next()
    }
}

module.exports = {
    userOnly,
    guestOnly
}