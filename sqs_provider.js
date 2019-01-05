(async function(){
  const fs = require('fs')
  const apis = require('./apis/fetch')
  const sqs = require('./lib/sqs')

  const SQS_URL = process.env.SQS_URL
  const project = '0B'
  const cityCodeArray = ['A','F','H']
  // const cityCodeArray = ['F']
  // const cityCode = 'F', townCode = 'F05'
  // const sectCode = '0217'
  // const sectionList = require(`./temp/section_${cityCode}_${townCode}.json`)


  for(let i = 0;i<cityCodeArray.length;i++) {
    const areasList = require(`./temp/town_${cityCodeArray[i]}.json`)

    for(const areaItem of areasList){
      const townCode = areaItem.code
      // const maxBuildId = areaItem.max

      const minBuildId = 1
      const maxBuildId = 10000
    
      const cityCode = cityCodeArray[i]
      const sectionList = require(`./temp/section_${cityCodeArray[i]}_${townCode}.json`)

      for(const sectItem of sectionList){

        for(let j=minBuildId;j<maxBuildId; j++) {
          const sectCode = sectItem.value
          const landBuild = `${j}`
          
          console.log(`cityCode = ${cityCode}, townCode = ${townCode}, sectCode = ${sectCode}, landBuild = ${landBuild}`)
        
          await sqs.sendMessage(SQS_URL, JSON.stringify({cityCode, townCode, sectCode, landBuild, project}))
        }
      }
    }
  }

  // for(const sectItem of sectionList){
  //   for(let i=1;i<1000; i++) {
  //     const sectCode = sectItem.value

  //     const landBuild = `${i}`
     
  //     await sqs.sendMessage(SQS_URL, JSON.stringify({cityCode, townCode, sectCode, landBuild, project}))

  //     // const res = (await apis.cmd(cityCode, townCode, sectCode, landBuild))
  
  //     // const {W, filePath} = JSON.parse(res)
      
  //     // if(!filePath) continue

  //     // console.log('filePath: ', filePath)

  //     // const res2 = await apis.getResult(W, filePath)
  //     // const html = await res2.text()
    
  //     // console.log(html)

  //     // if(!html.includes('錯誤'))
  //     //   fs.writeFileSync(`./tempResult/${cityCode}_${townCode}_${sectCode}_${landBuild}.html`, html)
  //   }
  // }
})()
