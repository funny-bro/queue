  const fs = require('fs')
  const s3 = require('./s3')
  const apis = require('../apis/fetch')
  const htmlParser = require('./htmlParser')

  const fetchLandBuild = async (cityCode, townCode, sectCode, landBuild, project, options = {}) => {
    try {
      const res = (await apis.cmd({cityCode, townCode, sectCode, landBuild, project}))

      const {W, ID, USERID, PROJECT, is_qry, is_message, filePath: filePathCmd} = JSON.parse(res)

      const resSendData = await apis.sendData(W, ID, USERID, PROJECT, is_qry, is_message)

      const filePathSendData = await resSendData.text()

      const filePath = filePathCmd || filePathSendData

      if(!filePath || filePath.includes('X32')) return {}
  
      const resRecordToRecord = await apis.recordToRecord(W, filePath)
      // console.log('resRecordToRecord: ', resRecordToRecord)

      const resGetResult = await apis.getResult(W, filePath)
      const html = await resGetResult.text()
      const json = htmlParser.project0B(html)
      
      if(!html.includes('錯誤')) {
        return {html, json}
      }

      return null
    }
    catch(err){
      console.log('Error fetchLandBuild: ', err)
      throw new Error(JSON.stringify(err))
    }
  }


  const fetchSingleData = async (cityCode, townCode, sectCode, landBuild, project, options = {}) => {
    try {
      const {isUploadResult = true, isReturnRaw = false} = options
      const res = (await apis.cmd({cityCode, townCode, sectCode, landBuild, project}))
  
      const {W, ID, USERID, PROJECT, is_qry, is_message, filePath: filePathCmd} = JSON.parse(res)
  
      const resSendData = await apis.sendData(W, ID, USERID, PROJECT, is_qry, is_message)

      const filePathSendData = await resSendData.text()
  
      const filePath = filePathCmd || filePathSendData
  
      const resRecordToRecord = await apis.recordToRecord(W, filePath)
      // console.log('resRecordToRecord: ', resRecordToRecord)
  
      const resGetResult = await apis.getResult(W, filePath)
      const html = await resGetResult.text()

      const fileName = `${cityCode}_${townCode}_${sectCode}_${landBuild}`
      const json = htmlParser.project0B(html)
      // console.log(html)
        
      if(isUploadResult && !html.includes('錯誤')) {

        console.log('json:', JSON.stringify(json))

        console.log('[INFO] Good HTML content, going to upload to S3: ', fileName)
        // fs.writeFileSync(`./html/${fileName}`, html, 'utf8')
        const bucket = process.env.S3_BUCKET
        await s3.uploadByData({data: html, fileName: `${fileName}.html`, bucket})

        console.log('[INFO] Good JSON content, going to upload to S3: ', fileName)
        await s3.uploadByData({data: JSON.stringify(json), fileName: `${fileName}.json`, bucket})
        return true
      }

      if(!html.includes('錯誤') && isReturnRaw) {
        return json
      }

      if(!html.includes('錯誤') && !isReturnRaw) {
        return true
      }

      return false
    }
    catch(err){
      // console.log('Error fetchSingleData: ', err)
      throw new Error(JSON.stringify(err))
    }
  }

  module.exports = {fetchSingleData, fetchLandBuild}