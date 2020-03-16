var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.post('/',async function(req, res, next) {
  const coinMarketCapApi_Server = axios.create({
    baseURL: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?cryptocurrency_type=all',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip',
      'Access-Control-Allow-Origin': '*',
      'X-CMC_PRO_API_KEY': '6ae65f3b-d149-4512-a292-204a2320f848'
    }
  })

  var response = await coinMarketCapApi_Server.get();
  res.send(response.data);
});

module.exports = router;
