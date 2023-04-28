const Crypto = require("../models/Crypto");

async function getAllCrypto({ name, paymentMethod } = { name: '', paymentMethod: '' }) {
    return Crypto.find({}).where('name').regex(new RegExp(name, 'i')).where('paymentMethod').regex(new RegExp(paymentMethod, 'i')).lean()
}

async function getCryptoById(id) {
    return Crypto.findById(id).lean()
}

async function deleteCryptoById(id) {
    await Crypto.findByIdAndDelete(id)
}

async function createCrypto({ name, image, price, description, paymentMethod, owner }) {
    await Crypto.create({
        name, image, price, description, paymentMethod, owner
    })
}

async function updateCryptoById(id, { name, image, price, description, paymentMethod }) {
    const crypto = await Crypto.findById(id)
    crypto.name = name
    crypto.image = image
    crypto.price = price
    crypto.description = description
    crypto.paymentMethod = paymentMethod
    await crypto.save()
}

async function buyCryptoById(cryptoId, userId) {
    const crypto = await Crypto.findById(cryptoId)
    crypto.boughtUsers.push(userId)
    await crypto.save()
}

module.exports = {
    getAllCrypto,
    getCryptoById,
    deleteCryptoById,
    createCrypto,
    updateCryptoById,
    buyCryptoById
}