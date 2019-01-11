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
    let addIndex = 10

    for(let i = 0;i<cityCodeArray.length;i++) {
      const areasList = require(`./temp/town_${cityCodeArray[i]}.json`)
  
      for(const areaItem of areasList){
        const townCode = areaItem.code
  
        const minBuildId = 50
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
                    addIndex = addIndex * 2
                    j += addIndex
                    failCount = 0
                    console.log('find available data, failCount reset 0')
                }
            }
            catch(err){
                // console.error('empty data')
                failCount++
                addIndex = 10
                console.log('find empty data, failCount+=1, failCount = ', failCount)
                    console.log('addIndex reset 0')
                if(failCount >= failCheckCount) {
                    const landBuildMax = `${j - failCount}`
    
                    console.log('!!=====================!!')
                    console.log(`cityCode = ${cityCode}, townCode = ${townCode}, sectCode = ${sectCode}, landBuild = ${landBuild}`)
                    console.log('landBuildMax',landBuildMax)
                        //write max to DB
                    console.log('!!=====================!!')
                    break
              
                }
            }
            

          }
        }
  
      }
    }
  })()
  