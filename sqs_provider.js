(async function(){
  const fs = require('fs')
  const sqs = require('./lib/sqs')
  const sectionDao = require('./db/section/dao')

  const SQS_URL = process.env.SQS_URL
  const project = '0B'

  // const SectionDao = require('./db/section/dao')
  const sequelize = require('./db/init')

  const res = await sequelize.query("SELECT * FROM zd.sections where landBuildMax > 100 and cityCode = 'F' and townCode = 'F05'")
  // const res = await sequelize.query("SELECT * FROM zd.sections where landBuildMax > 1")

  if(!res[0].length) {
    console.log('[INFO] no more section to process, before one day')
    return
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

  for(let i=0;i<res[0].length;i++) {
    await processSectionList(res[0][i])
  }
  process.exit()
})()
