import axios from 'axios'
import CONF from '../config/index.js'

const coinMarketCapApiBase = CONF.dev.coinMarketCapApiBase

const coinMarketCapApiServer = axios.create({
  baseURL: coinMarketCapApiBase,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
})

export default {
  getCoinMarketCapData: (token, to) => {
    return coinMarketCapApiServer.post(`/coinmarketcap`)
  }
}
