
const sqs = require('../lib/sqs')
const {fetchLandBuild} = require('../lib/fetchSingleData')
const db = require('./db')
const SQS_URL = process.env.SQS_URL
let count = 0

const fetchMessage = async () => {  
  const recieveResponse = await sqs.receiveMessage(SQS_URL)

  if(!recieveResponse.Messages || !recieveResponse.Messages[0]) {
    console.log('[WARN] message has null Body: ', recieveResponse)
    return {}
  }
  const {Body, ReceiptHandle} = recieveResponse && recieveResponse.Messages[0] && recieveResponse.Messages[0] || {}
  return {Body, ReceiptHandle}
}

const processQueue = async (Body, ReceiptHandle, authConfig) => {
  const data = JSON.parse(Body);
  const {cityCode,townCode,sectCode,landBuild, project} = data

  console.log('[INFO] processing ',cityCode, townCode, sectCode, landBuild, project)

  let res = {}
  try {
    res = await fetchLandBuild(cityCode, townCode, sectCode, landBuild, project, authConfig) || {}
  }
  catch(err) {
    console.log('[ERROR]', err)
    throw {
      message: err,
      isResetAuth: true
    }
    res = {}
  }
  
  const {html = '', json = {}} = res

  // fail condition 1
  if(!html || !json) {
    console.log('[INFO] empty landBuild')
    // go ahead if they are empty
    // throw new Error('null html or json')
  }

  // fail condition 2
  if(html.includes('錯誤')) return console.log('[ERROR]', '錯誤')

  const sectionInfo = {
    cityCode,
    townCode,
    sectCode,
    project
  }
  const landBuildInfo = { landBuild, json, html }

  await db.createOrUpdate(landBuildInfo, sectionInfo)
  await sqs.deleteMessage(SQS_URL, ReceiptHandle)
}

const main = async (authConfig) => {
  count +=1 
  if(count%30 ===0) console.log(` -=-=-=-=-=-= processed ${count} messages`)
  const {enuid, ensid, cookieValue} = authConfig
  const {Body, ReceiptHandle} = await fetchMessage(authConfig)
  if(Body && ReceiptHandle ) {
    await processQueue(Body, ReceiptHandle, authConfig)
    return main({enuid, ensid, cookieValue})
  }
  return
}

module.exports = main
