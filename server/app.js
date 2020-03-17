var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var router = express.Router();
var axios = require('axios');

var cors = require('cors')
var serverless = require('serverless-http');
var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

router.post('/coinmarketcap', async function(req, res) {
  console.log('test is going');
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
})


app.use('/.netlify/functions/app', router);  // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);