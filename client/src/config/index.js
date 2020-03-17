export default {
  dev: {
    coinMarketCapApiBase: 'http://localhost:9000/.netlify/functions/app',
    frontBase: 'http://localhost:8080/'
  },
  prod: {
    coinMarketCapApiBase: 'https://amazing-northcutt-68d4e0.netlify.com/.netlify/functions/app',
    frontBase: ''
  }
}
