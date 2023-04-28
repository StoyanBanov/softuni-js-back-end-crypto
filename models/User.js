const { Schema, model } = require('mongoose')

const schema = new Schema({
    username: { type: String, required: true, minLength: [5, 'The username must be at least 5 characters long!'] },
    email: { type: String, required: true, minLength: [10, 'The email must be at least 10 characters long!'] },
    password: { type: String, required: true }
})

schema.index({ username: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
})

schema.index({ email: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
})

const User = model('User', schema)

module.exports = User