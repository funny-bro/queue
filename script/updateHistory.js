(async function(){
  const Op = require('sequelize').Op
  const historyDao = require('../db/history/dao')
  const sectionDao = require('../db/section/dao')
  const landBuildRecordDao = require('../db/landBuildRecord/dao')

  const getNHourAgo = (n = 10) => {
    const ONE_HOUR = 60 * 60 * 1000; /* ms */

    const now = new Date();
    return new Date(now.getTime() - (n*ONE_HOUR));
  }

  const today = new Date()
  const hourAgo10 = getNHourAgo(10)

  const resLandBuild = await landBuildRecordDao.findAndCountAll({
    updatedAt: {
      [Op.gte]: hourAgo10,
      [Op.lt]: today
    }
  })

  const resSection = await sectionDao.findAndCountAll({
    updatedAt: {
      [Op.gte]: hourAgo10,
      [Op.lt]: today
    }
  })

  console.log('[INFO] landBuildRecord is updated: ', resLandBuild.count)
  console.log('[INFO] section is updated:         ', resSection.count)

  await historyDao.create({type: 'landBuildRecord', count: resLandBuild.count})
  await historyDao.create({type: 'section', count: resSection.count})

  console.log('done')
  process.exit()
})()