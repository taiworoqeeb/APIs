require("dotenv").config()

module.exports = {
    header: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
    },
    paylot: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PAYLOT_SECRET}`
    },
    identity: {
        'Content-Type': 'application/json',
        'x-api-key': `${process.env.IDENTITY_SECRET_KEY}`
    },
}