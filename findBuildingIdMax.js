(async function(){
    const fs = require('fs')
    const apis = require('./apis/fetch')
    const {fetchSingleDataForFindMaxId} = require('./lib/fetchSingleDataForFindMaxId')
    const project = '0B'
    // const cityCodeArray = ['A','F','H']
    const cityCodeArray = ['F','H','A']
    const sleep = (second = 3) =>
        new Promise(resolve => setTimeout(() => resolve(), second * 1000))

    const failCheckCount = 10
    let failCount = 0

    for(let i = 0;i<cityCodeArray.length;i++) {
      const areasList = require(`./temp/town_${cityCodeArray[i]}.json`)
  
      for(const areaItem of areasList){
        const townCode = areaItem.code
  
        const minBuildId = 1
        const maxBuildId = 50000 
      
        const cityCode = cityCodeArray[i]
        const sectionList = require(`./temp/section_${cityCodeArray[i]}_${townCode}.json`)
  
        for(const sectItem of sectionList){
  
          for(let j=minBuildId;j<=maxBuildId; j++) {
            const sectCode = sectItem.value
            const landBuild = `${j}`
            
            console.log(`cityCode = ${cityCode}, townCode = ${townCode}, sectCode = ${sectCode}, landBuild = ${landBuild}`)
          
            try {
                const isOk = await fetchSingleDataForFindMaxId(cityCode, townCode, sectCode, landBuild, project)
                if(isOk) {
                    j += 15
                    failCount = 0
                } else {
                    failCount++
                    console.log('failCount++')
                    if(failCount >= failCheckCount) {
                        const landBuildMax = `${j - failCount}`
    
                        console.log('=====================')
                        console.log(`cityCode = ${cityCode}, townCode = ${townCode}, sectCode = ${sectCode}, landBuild = ${landBuild}`)
                        console.log('landBuildMax',landBuildMax)
                        console.log('=====================')
                        await sleep(0.5)
              
                    }
                }
            }
            catch(err){
            //   console.error(err)
                console.error('empty data')
            }
            

          }
        }
  
      }
    }
  })()
  