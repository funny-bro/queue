(async function(){
  const sequelize = require('../db/init') 
  const landBuildRecordDao = require('../db/landBuildRecord/dao')

  const getTitleString = ({landBuild, sectionId}) => `${landBuild}:${sectionId}`
  const printRepeatData = (dataList) => {
    console.log('[INFO] There is ' , res.length, ' landBuildRecords')
    const idList = res.map(getTitleString)
    const uniqueIdList = [...new Set(idList)]; 
    console.log('[INFO] repeat data : ', idList.length - uniqueIdList.length)
  }

  const getRepeatData = (dataList) => {
    const idObjectList = res.map( item => {
      const {id, landBuild, updatedAt} = item
      return {
        id, landBuild, updatedAt,
        tId: getTitleString(item)
      }
    })
    const idList = res.map(getTitleString)
    const uniqueIdList = [...new Set(idList)]

    const repeatDataList = []
    let repeatIdList = []
    
    uniqueIdList.forEach(uniqueId => {
      const repeatPair = idObjectList.filter( item => uniqueId === item.tId)
      const currentIds = repeatPair.map(item => item.tId)

      if(repeatPair.length >1 && !repeatIdList.includes(currentIds[0].tId)){
        repeatIdList = [...repeatIdList, ...currentIds]
        repeatDataList.push([...repeatPair])
      }
    })

    return repeatDataList
  }

  const removePair = async ([obj1, obj2]) => {
    console.log(`[INFO] going to remove ${obj1.tId}`)
    if(obj2.updatedAt - obj1.updatedAt > 0){
      return await landBuildRecordDao.destroy({id: obj2.id})
    }

    return await landBuildRecordDao.destroy({id: obj1.id})
  }

  const res = await sequelize.query("SELECT * FROM zd.landBuildRecords", { type: sequelize.QueryTypes.SELECT})

  printRepeatData(res)
  const repeatDataList = getRepeatData(res)

  for(let i=0 ;i< repeatDataList.length; i++){
    await removePair(repeatDataList[i])
  }

  process.exit()
})()
