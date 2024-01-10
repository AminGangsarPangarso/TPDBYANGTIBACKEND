const express = require('express')
const midtransClient = require('midtrans-client');

const router = express.Router()

router.post("/process-transaction", (req, res) => {
    try {
        const snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: 'SB-Mid-server-Y9STqWwEpgtaK0yqy_D8MYkn',
            clientKey: 'SB-Mid-client-fZzSOY1XL-yd2Hyx'
        });

        const paramater = {
            transaction_detail: {
                product_id: req.body.product_id,
                total: req.body.total,
            },
            costumers_details: {
                first_name: req.body.username
            }
        }

        snap.createTransaction(paramater)
            .then((transaction) => {

            })

    } catch (error) {
        res.status(500).json((error))
    }
})

module.exports = router
















