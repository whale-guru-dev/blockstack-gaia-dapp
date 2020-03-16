import axios from 'axios'
import CONF from '../config/index.js'

const coinMarketCapApiBase = CONF.prod.coinMarketCapApiBase

const coinMarketCapApi_Server = axios.create({
  baseURL: coinMarketCapApiBase,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
})

export default {
  getCoinMarketCapData: (token, to) => {
    return coinMarketCapApi_Server.post(`/coinmarketcap`);
  },
}
