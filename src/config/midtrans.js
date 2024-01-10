require('dotenv/config');

import MidtransClient from 'midtrans-client'

const snap = new MidtransClient.Snap({
    isProduction : false,
    serverKey : process.env.MIDTRANS_SERVER_KEY,
});

export default snap