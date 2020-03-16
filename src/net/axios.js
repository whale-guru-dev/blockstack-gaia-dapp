import axios from 'axios'
import CONF from '../config/index.js'

const coinMarketCapApiBase = CONF.prod.coinMarketCapApiBase

const coinMarketCapApi_Server = axios.create({
  baseURL: coinMarketCapApiBase,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip',
    'Access-Control-Allow-Origin': '*',
    'X-CMC_PRO_API_KEY': CONF.prod.apiKey
  }
})

export default {
  getCoinMarketCapData: (token, to) => {
    return coinMarketCapApi_Server.get(`/v1/cryptocurrency/listings/latest?cryptocurrency_type=all`);
  },
}
