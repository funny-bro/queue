(async function(){
  const apis = require('./apis/fetch')
  const sqs = require('./lib/sqs')
  const s3 = require('./lib/s3')
  const SQS_URL = process.env.SQS_URL
  let count = 0
  const bucket = process.env.S3_BUCKET

  const fetchMessage = async () => {  
    const recieveResponse = await sqs.receiveMessage(SQS_URL)
  
    if(!recieveResponse.Messages || !recieveResponse.Messages[0]) {
      console.log('[WARN] message has null Body: ', recieveResponse)
      return {}
    }
    const {Body, ReceiptHandle} = recieveResponse && recieveResponse.Messages[0] && recieveResponse.Messages[0] || {}
    return {Body, ReceiptHandle}
  }

  const processQueue = async (Body, ReceiptHandle) => {
    const res = (await apis.cmd(JSON.parse(Body)))

    const {W, ID, USERID, PROJECT, is_qry, is_message} = JSON.parse(res)
    const resSendData = await apis.sendData(W, ID, USERID, PROJECT, is_qry, is_message)
    const filePath = await resSendData.text()
    if(filePath.includes(';X32')) {
      console.log('[INFO] empty filePath, removed Queue ')
      return await sqs.deleteMessage(SQS_URL, ReceiptHandle)
    }

    const resRecordToRecord = await apis.recordToRecord(W, filePath)
    // console.log('resRecordToRecord: ', resRecordToRecord)
    
    const resGetResult = await apis.getResult(W, filePath)
    const html = await resGetResult.text()
    const data = JSON.parse(Body);

    if(!html.includes('錯誤')) {
      const fileName = `${data.cityCode}_${data.townCode}_${data.sectCode}_${data.landBuild}.html`
      console.log('[INFO] Good HTML content, going to upload to S3: ', fileName)
      await s3.uploadByData({data: html, fileName, bucket})
      await sqs.deleteMessage(SQS_URL, ReceiptHandle)
    }
  }

  const main = async () => {
    count +=1 
    if(count%30 ===0) console.log(` -=-=-=-=-=-= processed ${count} messages`)
    const {Body, ReceiptHandle} = await fetchMessage()
    if(Body && ReceiptHandle ) {
      await processQueue(Body, ReceiptHandle)
      return main()
    }

    return
  }

  await main()
})()

