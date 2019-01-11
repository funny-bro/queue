const fs = require('fs')
const s3 = require('./s3')
const apis = require('../apis/fetch')

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
  
    if(!html.includes('錯誤')) {
      return true
    }
    return false
  }
  catch(err){
    throw new Error(err)
  }
}

module.exports = {fetchSingleDataForFindMaxId}