(async function(){
  const apis = require('./apis/fetch')
  const sqs = require('./lib/sqs')
  const s3 = require('./lib/s3')
  const {fetchLandBuild} = require('./lib/fetchSingleData')
  const landBuildRecordDao = require('./db/landBuildRecord/dao')
  const SectionDao = require('./db/section/dao')
  const SQS_URL = process.env.SQS_URL
  let count = 0
  const bucket = process.env.S3_BUCKET

  const today = new Date()
  const year = today.getUTCFullYear()
  const month = today.getUTCMonth() +1
  const date = today.getUTCDate()

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
    const data = JSON.parse(Body);
    const {cityCode,townCode,sectCode,landBuild, project} = data

    console.log('[INFO] processing ',cityCode, townCode, sectCode, landBuild, project)

    let res = {}
    try {
      res = await fetchLandBuild(cityCode, townCode, sectCode, landBuild, project) || {}
    }
    catch(err) {
      console.log('[ERROR]', err)
      res = {}
    }
    
    const {html = '', json = {}} = res

    if(!html || !json) {
      // console.log('[INFO] empty landBuild')
      await sqs.deleteMessage(SQS_URL, ReceiptHandle)
      return 
    }

    if(!html.includes('錯誤')) {
      const fileName = `${cityCode}_${townCode}_${sectCode}_${landBuild}.html`
      // console.log('[INFO] Good HTML content, going to upload to S3: ', fileName)
      // await s3.uploadByData({data: html, fileName, bucket})
      await sqs.deleteMessage(SQS_URL, ReceiptHandle)

      const sectionObj = await SectionDao.findOne({
        cityCode,
        townCode,
        sectCode,
        project
      })

      if(!sectionObj || !sectionObj.id ) {
        console.log('=============== section not found ================')
        throw new Error('section not found')
      }
      try {
        await landBuildRecordDao.create({
          landBuild: `${landBuild}`,
          data: JSON.stringify(json),
          html,
          status: 'UPDATING',
          sectionId: sectionObj.id
        })
        console.log('[INFO] data create finish')
      } catch(err){
        console.log('err:', err)
      }
    } else {
      console.log('[ERROR]', '錯誤')
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

