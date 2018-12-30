(async function(){
  const fs = require('fs')
  const apis = require('./apis/fetch')

  const res = (await apis.city())
  const cityList = await res.json()
  fs.writeFileSync(`./temp/city.json`, JSON.stringify(cityList, null, 4))

  for(const cityItem of cityList) {
    const {code: cityCode} = cityItem
    const res = (await apis.town(cityCode))
    const townList = await res.json()
    fs.writeFileSync(`./temp/town_${cityCode}.json`, JSON.stringify(townList, null, 4))


    for(const townItem of townList) {
      const {code: townCode} = townItem
      const res = (await apis.section(cityCode,townCode))
      const sectionList = await res.json()
      fs.writeFileSync(`./temp/section_${cityCode}_${townCode}.json`, JSON.stringify(sectionList, null, 4))  
    }
  }

  
  // const res = (await apis.cmd(cityCode, townCode, sectCode, landBuild, 20))
  // const {W, filePath} = JSON.parse(res)

  // const res2 = await apis.getResult(W, filePath)
  // const result = await res2.text()
})()
