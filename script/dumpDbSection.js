(async function(){
  // const processCuurentTownNode = async (currentNode, {sectCode, townCode}) => {
  //   const {landBuildMax, executedAt} = await SectionDao.findOne({sectCode, townCode}) || {}
  //   currentNode.update({landBuildMax, executedAt})
  // }

  const SectionDao = require('../db/section/dao')
  const LandBuildDao = require('../db/landBuildRecord/dao')
  const initDataTree = require('./utils/initDataTree')

  const {data: sectionDbList} = await SectionDao.findAndCountAll({}, {limit: 9999})
  const rootTree = initDataTree.init()

  const cityCodeArray = ['F', 'H', 'A']

  for (const cityCode of cityCodeArray) {
    for (const {code: townCode} of require(`../temp/town_${cityCode}.json`)) {
      console.log('[INFO] finished: ', cityCode, townCode)
      const TownJson = rootTree.getChild(cityCode).getChild(townCode).getJson(true)

      for (const sectCode of Object.keys(TownJson.child)) {
        const currentNode = rootTree.getChild(cityCode).getChild(townCode).getChild(sectCode)
        const sectionData = sectionDbList.find( item => item.townCode === townCode && item.sectCode === sectCode) || {}

        const {count: landBuildVal = 0} = await LandBuildDao.findAndCountAll({sectionId: sectionData.id}) || {}
        const {landBuildMax = null, executedAt} = sectionData

        if(landBuildMax) {
          currentNode.update({landBuildMax, landBuildVal, executedAt})
        }
      }
    }
  }

  // console.log(rootTree.getJson())

  require('fs').writeFileSync('dumpDbSection.json', JSON.stringify(rootTree.getJson(true)))

  process.exit()
})()
