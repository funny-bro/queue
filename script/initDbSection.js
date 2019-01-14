(async function(){
  const fs = require('fs')
  const apis = require('../apis/fetch')

  const countObject = {}
  const sectionDao = require('../db/section/dao')
  const project = '0B'
  const res = (await apis.city())
  const cityList = await res.json()
  // fs.writeFileSync(`../temp/city.json`, JSON.stringify(cityList, null, 4))

  for(const cityItem of cityList) {
    const {code: cityCode, title: cityString} = cityItem
    const res = (await apis.town(cityCode))
    const townList = await res.json()

    countObject[`city-${cityCode}`] = 0
    // fs.writeFileSync(`../temp/town_${cityCode}.json`, JSON.stringify(townList, null, 4))

    for(const townItem of townList) {
      const {code: townCode, title: townString} = townItem
      const res = (await apis.section(cityCode,townCode))
      const sectionList = await res.json()
      countObject[`town-${townCode}`] = 0
      // fs.writeFileSync(`../temp/section_${cityCode}_${townCode}.json`, JSON.stringify(sectionList, null, 4))  
      for(const [i, sectionItem] of sectionList.entries()){
        const {text: sectString, value: sectCode} = sectionItem
        // console.log('city:', cityCode, cityString)
        // console.log('   town:', townCode, townString)
        // console.log('       section:', sectCode, sectString)
        const data = {cityCode, cityString, townCode, townString, sectCode, sectString}
        // countObject[`sect-${sectCode}`] = 99
        countObject[`town-${townCode}`] +=1
        countObject[`city-${cityCode}`] +=1

        await sectionDao.create({cityCode, townCode, sectCode, project})
        if(i % 30) {
          console.log('[INFO] finished adding section : ', cityCode, townCode, sectCode, project)
        }
        // fs.writeFileSync(`../temp/csv/section_${cityCode}_${townCode}_${sectCode}.json`, JSON.stringify(data))  
      }
      console.log('[INFO] finished town : ', townString)
    }
    console.log('[INFO] finished city : ', cityString)
  }
})()
