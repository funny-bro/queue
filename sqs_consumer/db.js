const SectionDao = require('../db/section/dao')
const landBuildRecordDao = require('../db/landBuildRecord/dao')

const createOrUpdate = async (landBuildInfo = {}, sectInfo = {}) => {
    const {landBuild, json = {}, html = ''} = landBuildInfo
    // start success condition
    const existedSectionObj = await SectionDao.findOne(sectInfo)

    if(!existedSectionObj || !existedSectionObj.id ) {
      console.log('=============== section not found ================')
      throw new Error('[Error] section not found')
    }

    const landBuildRecordOBj = await landBuildRecordDao.findOne({
      landBuild: `${landBuild}`,
      sectionId: `${existedSectionObj.id}`
    }) || {}

    const id = landBuildRecordOBj.id || ''
    
    // Case1: create new if not existed
    if(!id) {
      await landBuildRecordDao.create({
        landBuild: `${landBuild}`,
        data: JSON.stringify(json),
        html,
        status: 'UPDATING',
        sectionId: existedSectionObj.id
      })
      return console.log('[INFO] landBUild data create finish')
    }

    // Case2: update exited no change one 
    if(landBuildRecordOBj.data === JSON.stringify(json)) {
      const status = 'NO_CHANGE'
      await landBuildRecordDao.update({status},{id})
      return console.log('[INFO] landBuild data update finish, (NO_CHANGE)')
    } 

    // Case3: update exited but change one 
    await landBuildRecordDao.update({
      data: JSON.stringify(json),
      html,
      status: 'UPDATING',
    },{
      landBuild: `${landBuild}`,
      sectionId: `${sectionObj.id}`
    })
    return console.log('[INFO] data update finish, (UPDATING)')
}

module.exports = {createOrUpdate}