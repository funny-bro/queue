const fetch = require('node-fetch')
const logger = require('./logger')

const _fetch = (url, options) => {
  const {headers, body, method} = options
  logger(url, {method, headers, body})
  return fetch(url, options)
}

module.exports = _fetch