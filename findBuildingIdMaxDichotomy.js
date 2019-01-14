(async function(){
    const fs = require('fs')
    const apis = require('./apis/fetch')
    const {fetchSingleDataForFindMaxId} = require('./lib/fetchSingleDataForFindMaxId')
    const project = '0B'
    // const cityCodeArray = ['A','F','H']
    const cityCodeArray = ['F','H','A']
    const sleep = (second = 3) =>
        new Promise(resolve => setTimeout(() => resolve(), second * 1000))

    const failCheckCount = 3
    let failCount = 0

    for(let i = 0;i<cityCodeArray.length;i++) {
        const areasList = require(`./temp/town_${cityCodeArray[i]}.json`)
    
            for(const areaItem of areasList){
            const townCode = areaItem.code
        
            const cityCode = cityCodeArray[i]
            const sectionList = require(`./temp/section_${cityCodeArray[i]}_${townCode}.json`)
    
            
            for(const sectItem of sectionList){
    

                let minBuildId = 50
                let maxBuildId = 30000 
                let currentBuildId = (minBuildId + maxBuildId)/2

                while(true) {
                    const sectCode = sectItem.value
                    const landBuild = `${currentBuildId}`
                    
                    console.log(`cityCode = ${cityCode}, townCode = ${townCode}, sectCode = ${sectCode}, landBuild = ${landBuild}`)
                

                    if(minBuildId >= maxBuildId || 
                        currentBuildId <= minBuildId || 
                        currentBuildId >= maxBuildId) {
                           //write max to DB
                        console.log('=====!!Find!!======')
                        break;
                    }
                   
                    try {
                        const isOk = await fetchSingleDataForFindMaxId(cityCode, townCode, sectCode, landBuild, project)
                        if(isOk) {
                            failCount = 0
                            console.log('find available data, failCount reset 0')
                            minBuildId = currentBuildId
                            currentBuildId = parseInt((minBuildId + maxBuildId)/2)
                            console.log('minBuildId', minBuildId)
                            console.log('maxBuildId', maxBuildId)
                            console.log('currentBuildId', currentBuildId)
                        }
                    }
                    catch(err){
                        failCount++
                        currentBuildId++

                        console.log('find empty data, failCount+=1, failCount = ', failCount)
                         
                        if(failCount >= failCheckCount) {
                            failCount = 0

                            maxBuildId = currentBuildId-failCheckCount
                            currentBuildId = parseInt((minBuildId + maxBuildId)/2)

                            console.log('minBuildId', minBuildId)
                            console.log('maxBuildId', maxBuildId)
                            console.log('currentBuildId', currentBuildId)
                        }
                    }
                }
            }
        }
    }
})()
  