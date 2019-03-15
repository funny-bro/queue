(async function(){
  const SectionDao = require('../db/section/dao')
  const landBuildRecordDao = require('../db/landBuildRecord/dao')
  const initDataTree = require('./utils/initDataTree')

  const root = initDataTree.init()
  
  console.log(root.getJson(true))

  require('fs').writeFileSync('test123.json', JSON.stringify(root.getJson(true)))

  process.exit()
})()
