const htmlParserNat = require('../../lib/htmlParserNat')

describe('htmlParserNat', async ()=>{
  it('parser: single', async ()=>{
    const htmlPath = __dirname + '/__mocks__/natHtml.html'
    const html = require('fs').readFileSync(htmlPath, 'utf8')
    const result = htmlParserNat.parser(html)
    expect(result.length).toBe(1)
    expect(result[0].order).toBe('0001000')
    expect(result[0].name).toBe('華南商業銀行股份有限公司')
  })
  it('parser: multiple', async ()=>{
    const htmlPath = __dirname + '/__mocks__/natHtmlMultiple.html'
    const html = require('fs').readFileSync(htmlPath, 'utf8')
    const result = htmlParserNat.parser(html)
    expect(result.length).toBe(2)
    expect(result[0].order).toBe('0005000')
    expect(result[0].name).toBe('聯邦商業銀行股份有限公司')
    expect(result[1].order).toBe('0006000')
    expect(result[1].name).toBe('聯邦商業銀行股份有限公司')
  })
})
