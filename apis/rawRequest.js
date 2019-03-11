const request = require('request');
const logger = require('./logger')

const rawRequest = ({url, method, headers, body}) => {
  const options = {
      url,
      method,
      headers,
      body
  };

  logger(url, {method, headers, body})

  return new Promise((resolve, reject)=>{
    request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          return resolve(body);
        }
        return reject(error)
    });
  })
}

module.exports = rawRequest