(async function(){
  const fs = require('fs')
  const sqs = require('./lib/sqs')
  const sectionDao = require('./db/section/dao')

  const SQS_URL = process.env.SQS_URL
  const project = '0B'

  // const SectionDao = require('./db/section/dao')
  const sequelize = require('./db/init')

  // const res = await sequelize.query("SELECT * FROM zd.sections where updatedAt <  DATE_ADD(CURDATE(), INTERVAL -1 DAY)")
  const res = await sequelize.query("SELECT * FROM zd.sections where landBuildMax > 1")

  if(!res[0].length) {
    console.log('[INFO] no more section to process, before one day')
    return
  }

  const item = res[0][0]

  const {id, cityCode, townCode, sectCode, landBuildMax} = item
  console.log(`[INFO] section object found in DB: cityCode = ${cityCode}, townCode = ${townCode}, sectCode = ${sectCode}, landBuildMax = ${landBuildMax}`)

  for(let i=0;i<=landBuildMax;i++){
    await sqs.sendMessage(SQS_URL, JSON.stringify({cityCode, townCode, sectCode, i, project}))
  }

  console.log(`[INFO] ${landBuildMax} SQS message is sent.`)

  await sectionDao.update({executedAt: new Date()}, {id})
  console.log(`[INFO] finished process: cityCode = ${cityCode}, townCode = ${townCode}, sectCode = ${sectCode}, landBuildMax = ${landBuildMax}`)
  process.exit()
})()
