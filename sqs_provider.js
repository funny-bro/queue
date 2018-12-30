(async function(){
  const fs = require('fs')
  const apis = require('./apis/fetch')
  const sqs = require('./lib/sqs')

  const SQS_URL = process.env.SQS_URL

  const cityCode = 'A', townCode = 'A02'
  // const sectCode = '0217'
  const sectionList = require(`./temp/section_${cityCode}_${townCode}.json`)


  for(const sectItem of sectionList){
    for(let landBuild=1600;landBuild<100000; landBuild++) {
      if(landBuild % 30 ===0) {
        console.log(' landBuild: ', landBuild)
      }
      const sectCode = sectItem.value
      await sqs.sendMessage(SQS_URL, JSON.stringify({cityCode, townCode, sectCode, landBuild}))

      // const res = (await apis.cmd(cityCode, townCode, sectCode, landBuild))
  
      // const {W, filePath} = JSON.parse(res)
      
      // if(!filePath) continue

      // console.log('filePath: ', filePath)

      // const res2 = await apis.getResult(W, filePath)
      // const html = await res2.text()
    
      // console.log(html)

      // if(!html.includes('錯誤'))
      //   fs.writeFileSync(`./tempResult/${cityCode}_${townCode}_${sectCode}_${landBuild}.html`, html)
    }
  }
})()
