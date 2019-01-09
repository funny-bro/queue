  const fs = require('fs')
  const s3 = require('./s3')
  const apis = require('../apis/fetch')
  const htmlParser = require('./htmlParser')

  const fetchSingleData = async (cityCode, townCode, sectCode, landBuild, project) => {
    try {
      const res = (await apis.cmd({cityCode, townCode, sectCode, landBuild, project}))
  
      const {W, ID, USERID, PROJECT, is_qry, is_message, filePath: filePathCmd} = JSON.parse(res)
  
      const resSendData = await apis.sendData(W, ID, USERID, PROJECT, is_qry, is_message)

      const filePathSendData = await resSendData.text()
  
      const filePath = filePathCmd || filePathSendData
  
      const resRecordToRecord = await apis.recordToRecord(W, filePath)
      console.log('resRecordToRecord: ', resRecordToRecord)
  
      const resGetResult = await apis.getResult(W, filePath)
      const html = await resGetResult.text()
      // console.log(html)
    
      if(!html.includes('錯誤')) {
        const fileName = `${cityCode}_${townCode}_${sectCode}_${landBuild}`
        const json = htmlParser.project0B(html)

        console.log('json:', JSON.stringify(json))

        console.log('[INFO] Good HTML content, going to upload to S3: ', fileName)
        // fs.writeFileSync(`./html/${fileName}`, html, 'utf8')
        const bucket = process.env.S3_BUCKET
        await s3.uploadByData({data: html, fileName: `${fileName}.html`, bucket})

        console.log('[INFO] Good JSON content, going to upload to S3: ', fileName)
        await s3.uploadByData({data: JSON.stringify(json), fileName: `${fileName}.json`, bucket})
        return true
      }
      return false
    }
    catch(err){
      console.log('Error fetchSingleData: ', err)
      throw new Error(err)
    }
  }

  module.exports = {fetchSingleData}