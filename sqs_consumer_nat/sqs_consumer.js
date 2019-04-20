const sqs = require('../lib/sqs')
const htmlParserNat = require('../lib/htmlParserNat')
const {innerRequest} = require('../lib/natApi/')
const db = require('./db')
const SQS_URL = process.env.SQS_URL
const MAX_COND3_COUNT = 15
let count = 0
let cond3Count = 0

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
    console.log('[CONDITION1] empty landBuild')
    cond3Count = 0
    // go ahead if they are empty
    // throw new Error('null html or json')
  }
  // fail condition 2
  if(resString.includes('未取得使用授權而欲進入本系統')) {
    console.log('[CONDITION2] 未取得使用授權而欲進入本系統')
    cond3Count = 0
    throw {
      message: '未取得使用授權而欲進入本系統',
      isResetAuth: true
    }
  }
  // fail condition 3
  if(resString.includes('<table class="cfdump_struct">')){
    // cond3Count+=1
    console.log('[CONDITION3] class=cfdump_struct')
  }
  // fail condition 4
  if(!resString)  {
    cond3Count = 0
    console.log('[CONDITION4] null ResString')
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
  if(count%30 ===0) console.log(` -=-=-=-=-=-= processed ${count} messages: cond3Count: ${cond3Count}`)

  if(cond3Count >= MAX_COND3_COUNT) {
    const t = count
    count = 0
    cond3Count = 0
    throw{
      message: `[INFO] hit design limit ${MAX_COND3_COUNT}`,
      count: t,
      isResetAuth: true
    }
  }

  const {cookieValue, cfid, cftoken} = authConfig
  const {Body, ReceiptHandle} = await fetchMessage(authConfig)
  if(Body && ReceiptHandle ) {
    await processQueue(Body, ReceiptHandle, authConfig)
    await sleep(3)
    return sqsConsumerTask({cookieValue, cfid, cftoken})
  }

}

module.exports = sqsConsumerTask
