(async function(){
  const Op = require('sequelize').Op
  const historyDao = require('../db/history/dao')
  const sectionDao = require('../db/section/dao')
  const landBuildRecordDao = require('../db/landBuildRecord/dao')

  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1);


  const resLandBuild = await landBuildRecordDao.findAndCountAll({
    updatedAt: {
      [Op.gte]: yesterday,
      [Op.lt]: today
    }
  })

  const resSection = await sectionDao.findAndCountAll({
    updatedAt: {
      [Op.gte]: yesterday,
      [Op.lt]: today
    }
  })

  await historyDao.create({type: 'landBuildRecord', count: resLandBuild.count})
  await historyDao.create({type: 'section', count: resSection.count})

  console.log('done')
  process.exit()
})()