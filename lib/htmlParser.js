const cheerio = require('cheerio')
const entities = require("entities");

const project0B =(html) => {
  if(!html) return null

  const $ = cheerio.load(html)
  const returnData = []
  let index = 0

  $('tr a').each(function(i, el) {
    const text = entities.decodeHTML($(this).text()).replace(/[\r\t]/g, ''); 

    if(i % 3 ===0) {
      const order = text, type = '', name = ''
      index +=1
      return returnData.push({order, type, name})
    }

    if(i % 3 ===1) {
      return returnData[index-1].type = text
    }

    if(i % 3 ===2) {
      return returnData[index-1].name = text
    }
  })

  return returnData
}

module.exports = {project0B}