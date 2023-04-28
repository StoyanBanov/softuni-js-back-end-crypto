const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    name: { type: String, required: true, minLength: [2, 'The name must be a least 2 characters long!'] },
    image: { type: String, required: true, match: [/https?:\/\/.+/i, 'The image URL is not valid!'] },
    price: { type: Number, required: true, validate: { validator: value => value > 0, message: 'The price must be a positive number!' } },
    description: { type: String, required: true, minLength: [10, 'The description must be a least 10 characters long!'] },
    paymentMethod: { type: String, enum: ['crypto-wallet', 'credit-card', 'debit-card', 'paypal'], required: true },
    boughtUsers: { type: [ObjectId], ref: 'User', default: [] },
    owner: { type: ObjectId, ref: 'User' }
})

const Crypto = model('Crypto', schema)

module.exports = Crypto