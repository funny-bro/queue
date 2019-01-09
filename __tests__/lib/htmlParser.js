const htmlParser = require('../../lib/htmlParser')

describe('storage', async ()=>{
  it('upload', async ()=>{
    const htmlPath = __dirname + '/__mocks__/project0BMultiple.html'
    const html = require('fs').readFileSync(htmlPath, 'utf8')
    const jsonObj = htmlParser.project0B(html)
    console.log(jsonObj)
  })
})
