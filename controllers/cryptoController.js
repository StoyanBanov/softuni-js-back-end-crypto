const { getAllCrypto, createCrypto, getCryptoById, updateCryptoById, buyCryptoById, deleteCryptoById } = require('../services/cryptoService')
const { userOnly } = require("../middleware/guars")
const { body, validationResult } = require('express-validator')
const { parseErrs } = require('../util/errorParser')
const { parseOtherErrsToExpressValidationErrs } = require('../util/errorParser')

const cryptoController = require('express').Router()

cryptoController.get('/catalog', async (req, res) => {
    const allCrypto = await getAllCrypto()
    res.render('catalog', {
        allCrypto
    })
})

cryptoController.get('/:id/details', async (req, res) => {
    try {
        const crypto = await getCryptoById(req.params.id)
        if (req.user) {
            crypto.isOwner = crypto.owner == req.user._id
            if (!crypto.isOwner) crypto.hasBought = crypto.boughtUsers.map(String).includes(req.user._id)
        }
        res.render('details', crypto)
    } catch (error) {
        console.log(error);
        res.render('404')
    }
})

cryptoController.use(userOnly())

cryptoController.get('/search', async (req, res) => {
    const search = req.query
    const allCrypto = await getAllCrypto(search)
    res.render('search', {
        allCrypto,
        search
    })
})

cryptoController.get('/create', async (req, res) => {
    res.render('create')
})

cryptoController.post('/create',
    body(['name', 'price', 'image', 'description', 'paymentMethod']).trim(),
    body('price').isNumeric().withMessage('The price must be a number!'),
    async (req, res) => {
        const { errors } = validationResult(req)
        try {
            if (errors.length > 0) throw errors
            await createCrypto(Object.assign(req.body, { owner: req.user._id }))
            res.redirect('/crypto/catalog')
        } catch (error) {
            if (!Array.isArray(error)) errors.push(...parseOtherErrsToExpressValidationErrs(error))
            res.render('create', {
                crypto: req.body,
                errorsObj: parseErrs(errors)
            })
        }
    })

cryptoController.get('/:id/edit', async (req, res) => {
    try {
        const crypto = await getCryptoById(req.params.id)
        if (crypto.owner != req.user._id) res.redirect(`/crypto/${crypto._id}/details`)
        else res.render('edit', { crypto })
    } catch (error) {
        res.render('404')
    }
})

cryptoController.post('/:id/edit',
    body(['name', 'price', 'image', 'description', 'paymentMethod']).trim(),
    body('price').isNumeric().withMessage('The price must be a number!'),
    async (req, res) => {
        const { errors } = validationResult(req)
        let crypto
        try {
            crypto = await getCryptoById(req.params.id)
            if (crypto.owner != req.user._id) res.redirect(`/crypto/${crypto._id}/details`)
            if (errors.length > 0) throw errors
            await updateCryptoById(req.params.id, req.body)
            res.redirect(`/crypto/${req.params.id}/details`)
        } catch (error) {
            if (crypto) {
                if (!Array.isArray(error)) errors.push(...parseOtherErrsToExpressValidationErrs(error))
                res.render('edit', {
                    crypto: Object.assign(req.body, { _id: req.params.id }),
                    errorsObj: parseErrs(errors)
                })
            } else res.render('404')
        }
    })

cryptoController.get('/:id/buy', async (req, res) => {
    try {
        const crypto = await getCryptoById(req.params.id)
        if (!(crypto.owner == req.user._id) && !crypto.boughtUsers.includes(req.user._id))
            await buyCryptoById(req.params.id, req.user._id)
        res.redirect(`/crypto/${crypto._id}/details`)
    } catch (error) {
        res.render('404')
    }
})

cryptoController.get('/:id/delete', async (req, res) => {
    try {
        const crypto = await getCryptoById(req.params.id)
        if (crypto.owner == req.user._id)
            await deleteCryptoById(req.params.id)
        res.redirect(`/crypto/catalog`)
    } catch (error) {
        res.render('404')
    }
})

module.exports = cryptoController