(async function(){
    const SectionDao = require('../db/section/dao')
    const landBuildRecordDao = require('../db/landBuildRecord/dao')

    const {fetchSingleDataForFindMaxId} = require('../lib/fetchSingleDataForFindMaxId')
    const project = '0B'
    // const cityCodeArray = ['F','H','A']
    const cityCodeArray = ['F']
    const failCheckCount = 3
    let failCount = 0

    for(let i = 0;i<cityCodeArray.length;i++) {
        const areasList = require(`../temp/town_${cityCodeArray[i]}.json`)
    
        for(const areaItem of areasList){
            const townCode = areaItem.code
            const cityCode = cityCodeArray[i]
            const sectionList = require(`../temp/section_${cityCodeArray[i]}_${townCode}.json`)
    
            for(const sectItem of sectionList){
                const sectCode = sectItem.value
                let minBuildId = 50
                let maxBuildId = 30000 
                let currentBuildId = (minBuildId + maxBuildId)/2
                let processCount = 0

                console.log(`[INFO] Going to process cityCode: ${cityCode},  townCode = ${townCode}, sectCode = ${sectCode}`)

                const sectionObj = await SectionDao.findOne({
                    cityCode,
                    townCode,
                    sectCode,
                    project
                })
                if(sectionObj && sectionObj.id && sectionObj.landBuildMax !==1 ) {
                    console.log(`[INFO] Already processed Section: landBuildMax: ${sectionObj.landBuildMax}`)
                    console.log('=============== Skip ================')
                    continue
                }

                while(true) {
                    const landBuild = `${currentBuildId}`

                    if(processCount && processCount %30 ===0) {
                        console.log('[INFO] process 30 data')
                    }
                    processCount ++
                    
                    // console.log(`cityCode = ${cityCode}, townCode = ${townCode}, sectCode = ${sectCode}, landBuild = ${landBuild}`)
                
                    if(minBuildId >= maxBuildId || 
                        currentBuildId <= minBuildId || 
                        currentBuildId >= maxBuildId) {
                           //write max to DB
                        console.log(`[INFO] spent ${processCount} times API call`)
                        console.log('=============== Find ================')
                        const payload = {
                            cityCode,
                            townCode,
                            sectCode,
                            project
                        }
                        const {id} = await SectionDao.findOne(payload)
                        await SectionDao.update({landBuildMax: landBuild}, {id})
                        console.log(`[INFO] db updated : landBuildMax = ${landBuild}`)

                        break;
                    }
                   
                    try {

                        let res = await fetchSingleDataForFindMaxId(cityCode, townCode, sectCode, landBuild, project)
                        const {html = '', json = {}} = res

                        // const isOk = await fetchSingleDataForFindMaxId(cityCode, townCode, sectCode, landBuild, project)
                        // if(isOk) {
                        if(!html.includes('錯誤')) {
                            failCount = 0
                            minBuildId = currentBuildId
                            currentBuildId = parseInt((minBuildId + maxBuildId)/2)
                            console.log(`[INFO] Find available data, failCount reset 0: minBuildId: ${minBuildId},  maxBuildId = ${maxBuildId}, currentBuildId = ${currentBuildId}, `)

                            const sectionObj = await SectionDao.findOne({
                                cityCode,
                                townCode,
                                sectCode,
                                project
                              })
                              if(!sectionObj || !sectionObj.id ) {
                                console.log('=============== section not found ================')
                                throw new Error('section not found')
                              }
                              try {
                                await landBuildRecordDao.create({
                                  landBuild: `${landBuild}`,
                                  data: JSON.stringify(json),
                                  html,
                                  status: 'UPDATING',
                                  sectionId: sectionObj.id
                                })
                                console.log(`[INFO] Find available data, add to DB`)
                              }
                              catch(err){
                                console.log('add to DB err:', err)
                              }

                        }
                    }
                    catch(err){
                        failCount++
                        currentBuildId++

                        if(failCount >= failCheckCount) {
                            failCount = 0

                            maxBuildId = currentBuildId-failCheckCount
                            currentBuildId = parseInt((minBuildId + maxBuildId)/2)
                        }
                    }
                }
            }
        }
    }

  process.exit()
})()
  