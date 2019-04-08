const sqs = require('../lib/sqs')
const htmlParserNat = require('../lib/htmlParserNat')
const {innerRequest} = require('../lib/natApi/')
const db = require('./db')
const SQS_URL = process.env.SQS_URL
const MAX_COUNT = 200
let count = 0

const sleep = (second = 3) => new Promise(resolve => setTimeout(() => resolve(), second * 1000))

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

  // const data = {cityCode : 'H', townCode : 'H06', sectCode : '0810', landBuild : 222, project : '0B'}
  // const data = {cityCode : 'F', townCode : 'F05', sectCode : '1787', landBuild : 305, project : '0B'}
  const data = JSON.parse(Body);
  const {cityCode,townCode,sectCode,landBuild, project} = data

  console.log('[INFO] processing ',cityCode, townCode, sectCode, landBuild, project)

  let resString
  let json = {}
  try {
    //city, town, seciton, landbuild, cookies
    resString = await innerRequest(cityCode, townCode, sectCode, landBuild, authConfig) || {}
  }
  catch(err) {
    console.log('[ERROR] innerRequest Exception', err)
    throw {
      message: err,
      isResetAuth: true
    }
    resString = ''
  }
  
  // fail condition 1
  if(resString.includes('<<查詢結果>>error<</查詢結果>>')) {
    console.log('[INFO] empty landBuild')
    // go ahead if they are empty
    // throw new Error('null html or json')
  }
  // fail condition 1
  if(resString.includes('未取得使用授權而欲進入本系統')) {
    console.log('[INFO] 未取得使用授權而欲進入本系統')
    throw {
      message: '未取得使用授權而欲進入本系統',
      isResetAuth: true
    }
  }

  if(resString.includes('<table class="cfdump_struct">')){
    console.log('[INFO] empty landBuild: class=cfdump_struct')
  }

  if(!resString)  {
    console.log('[INFO] null ResString')
  }

  if(resString.includes('<<查詢結果>>OK<</查詢結果>>')) {
    console.log(' -=-=-=- good -=-=-= includes ＊', resString.includes('＊'))
    // require('fs').writeFileSync(`./test_${new Date().getTime()}.txt`, resString)
    json = htmlParserNat.parser(resString)
  }

  // require('fs').writeFileSync(`./test_${new Date().getTime()}.txt`, resString)

  const sectionInfo = {
    cityCode,
    townCode,
    sectCode,
    project
  }
  const landBuildInfo = { landBuild, json, html: 'skip' }
  await db.createOrUpdate(landBuildInfo, sectionInfo)
  await sqs.deleteMessage(SQS_URL, ReceiptHandle)
}

const sqsConsumerTask = async (authConfig) => {
  count +=1 
  if(count%30 ===0) console.log(` -=-=-=-=-=-= processed ${count} messages`)

  if(count >= MAX_COUNT) {
    const t = count
    count = 0
    throw{
      message: `[INFO] hit design limit ${MAX_COUNT}`,
      count: t,
      isResetAuth: true
    }
  }

  const {cookieValue, cfid, cftoken} = authConfig
  const {Body, ReceiptHandle} = await fetchMessage(authConfig)
  if(Body && ReceiptHandle ) {
    await processQueue(Body, ReceiptHandle, authConfig)
    return sqsConsumerTask({cookieValue, cfid, cftoken})
    await sleep(3)
  }

}

module.exports = sqsConsumerTask
