const {big5Encode} = require('../../lib/string')

describe('lib/string', ()=>{
  it('big5Encode - 新北市', ()=>{
      const result = big5Encode('新北市')
      expect(result).toBe('%B7s%A5_%A5%AB')
  })
  it('big5Encode - 新莊區', ()=>{
      const result = big5Encode( '新莊區')
      expect(result).toBe('%B7s%B2%F8%B0%CF')
  })
  it('big5Encode - 桃園市', ()=>{
      const result = big5Encode('桃園市')
      expect(result).toBe('%AE%E7%B6%E9%A5%AB')
  })
  it('big5Encode - 桃園區', ()=>{
      const result = big5Encode('桃園區')
      expect(result).toBe('%AE%E7%B6%E9%B0%CF')
  })
})


