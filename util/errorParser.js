function parseErrs(errors) {
    return {
        messages: errors.map(e => e.msg)
    }
}

function parseOtherErrsToExpressValidationErrs(error) {
    if (error.name == 'ValidationError') {
        return Object.values(error.errors).map(e => ({ msg: e.properties.message }))
    } else {
        return [{ msg: error.message }]
    }
}

module.exports = {
    parseErrs,
    parseOtherErrsToExpressValidationErrs
}