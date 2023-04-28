const { verifyToken } = require("../services/authService")

module.exports = () => (req, res, next) => {
    const token = req.cookies.token
    if (token) {
        try {
            const data = verifyToken(token)
            req.user = data
        } catch (error) {
            res.clearCookie('token')
            res.redirect('/auth/login')
        }
    }
    next()
}