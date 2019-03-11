const argv = require('optimist').argv;

module.exports = (url, {method, headers, body}) => {
  if (argv.debug) {
    console.log(`[DEBUG] ${method}`)
    console.log(url)
    console.log('   headers : ', headers)
    console.log('   body    : ', body)
  }
}