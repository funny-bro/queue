(async function(){
  const fs = require('fs')
  const s3 = require('./lib/s3')
  const apis = require('./apis/fetch')


  const sleep = (second = 3) =>
    new Promise(resolve => setTimeout(() => resolve(), second * 1000))
    
  const fetchOk = async (cityCode, townCode, sectCode, landBuild, project) => {
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
      const fileName = `${cityCode}_${townCode}_${sectCode}_${landBuild}.html`
      console.log('[INFO] Good HTML content, going to upload to S3: ', fileName)
      const bucket = process.env.S3_BUCKET
      await s3.uploadByData({data: html, fileName, bucket})
      return true
    }

    return false
  }

  const dataList = [
    {cityCode : 'F', townCode : 'F05', sectCode : '1787', landBuild : 305, project : '0B'},
    {cityCode : 'F', townCode : 'F05', sectCode : '1787', landBuild : 303, project : '0B'},
    {cityCode : 'F', townCode : 'F14', sectCode : '0165', landBuild : 321, project : '0B'},
    {cityCode : 'F', townCode : 'F14', sectCode : '0165', landBuild : 303, project : '0B'},
  ]
  
  for(let i =0 ;i<dataList.length; i++){
    const {cityCode, townCode, sectCode, landBuild, project} = dataList[i]
    const isOk = await fetchOk(cityCode, townCode, sectCode, landBuild, project)
    console.log( isOk? 'good' : 'bad')
    await sleep(0.5)
  }

})()
