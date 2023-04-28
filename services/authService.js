const User = require("../models/User");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const jwtSecret = 'mySecret'

async function register({ username, email, password }) {
    const user = await User.create({
        username, email,
        password: await bcrypt.hash(password, 10)
    })
    return generateToken(user)
}

async function login({ email, password }) {
    const existingUser = await User.findOne({ email })
    if (!existingUser || !await bcrypt.compare(password, existingUser.password))
        throw new Error('Wrong email or password!')
    return generateToken(existingUser)
}

function generateToken(user) {
    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email
    }
    return jwt.sign(payload, jwtSecret, { expiresIn: '4h' })
}

function verifyToken(token) {
    return jwt.verify(token, jwtSecret)
}

module.exports = {
    register,
    login,
    verifyToken
}