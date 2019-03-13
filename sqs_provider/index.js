(async function(){
  const sqs = require('../lib/sqs')
  const sectionDao = require('../db/section/dao')
  const Op = require('sequelize').Op

  const SQS_URL = process.env.SQS_URL
  const project = '0B'
  const MIN_LANDBUILD_MAX = 52
  const DEFAULT_CITY_CODE = 'F'
  const DEFAULT_TOWN_CODE = 'F28'

  const isQueueEmpty = async () => {  
    const recieveResponse = await sqs.receiveMessage(SQS_URL)
  
    if(!recieveResponse.Messages || !recieveResponse.Messages[0]) {
      console.log('[INFO] message has null Body: ', recieveResponse)
      return true
    } else {
      return false
    }
  }

  const processSectionList = async (sectionItem) => {
    const {id, cityCode, townCode, sectCode, landBuildMax} = sectionItem
    console.log(`[INFO] section object found in DB: cityCode = ${cityCode}, townCode = ${townCode}, sectCode = ${sectCode}, landBuildMax = ${landBuildMax}`)

    for(let i=1;i<=landBuildMax;i++){
      const landBuild = i 
      // console.log(`[INFO] adding message to queue: cityCode = ${cityCode}, townCode = ${townCode}, sectCode = ${sectCode}, landBuild = ${landBuild}, project = ${project}`)
      await sqs.sendMessage(SQS_URL, JSON.stringify({cityCode, townCode, sectCode, landBuild, project}))
    }

    console.log(`[INFO] ${landBuildMax} SQS message is sent.`)

    await sectionDao.update({executedAt: new Date()}, {id})
    console.log(`[INFO] finished process: cityCode = ${cityCode}, townCode = ${townCode}, sectCode = ${sectCode}, landBuildMax = ${landBuildMax}`)
  }

  const options = {
    order: [
      ['updatedAt','ASC']
    ]
  }
  const response = await sectionDao.findAndCountAll({
    landBuildMax: {
      [Op.gt]: MIN_LANDBUILD_MAX,
    },
    cityCode: DEFAULT_CITY_CODE,
    townCode: DEFAULT_TOWN_CODE
  }, options)

  if(!response.data.length) {
    console.log('[INFO] no more section to process, before one day')
    return
  }

  if(!await isQueueEmpty()) {
    console.log(`[INFO] queue messages exist`)
    process.exit()
  }
    
  console.log(`[INFO] found ${response.count} section Object`)
  const sectionObjectList = response.data
  for(let i=0;i<sectionObjectList.length;i++) {
    await processSectionList(sectionObjectList[i])
  }

  process.exit()
})()
