const apis = require('../apis/fetch')
const htmlParser = require('./htmlParser')

const fetchSingleDataForFindMaxId = async (cityCode, townCode, sectCode, landBuild, project) => {
  try {
    const res = (await apis.cmd({cityCode, townCode, sectCode, landBuild, project}))

    const {W, ID, USERID, PROJECT, is_qry, is_message, filePath: filePathCmd} = JSON.parse(res)

    const resSendData = await apis.sendData(W, ID, USERID, PROJECT, is_qry, is_message)

    const filePathSendData = await resSendData.text()

    const filePath = filePathCmd || filePathSendData

    const resRecordToRecord = await apis.recordToRecord(W, filePath)

    const resGetResult = await apis.getResult(W, filePath)
    const html = await resGetResult.text()
    const json = htmlParser.project0B(html)
  
    if(!html.includes('錯誤')) {
      return {html, json}
    }
    return false
  }
  catch(err){
    throw new Error(err)
  }
}

module.exports = {fetchSingleDataForFindMaxId}