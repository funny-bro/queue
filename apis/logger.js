const argv = require('optimist').argv;

module.exports = (url, {method, headers, body}) => {
  if (argv.debug) {
    const timeStamp = new Date().getTime()
    const fileName = url.replace(/\W/g, '')

    require('fs').writeFileSync(`./${fileName}-${timeStamp}.json`, JSON.stringify({
      method,
      url,
      headers,
      body
    }))

    console.log(`[DEBUG] ${method}`)
    console.log(url)
    console.log('   headers : ', headers)
    console.log('   body    : ', body)
  }
}