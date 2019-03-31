(async function(){

  const natApi = require('./lib/nat')
  const {pad} = require('./lib/string')

  const CFID = process.env.CFID
  const CFTOKEN = process.env.CFTOKEN

  console.log('CFID: ', CFID)
  console.log('CFTOKEN: ', CFTOKEN)
  
  const cookies = {CFID, CFTOKEN}

  const sleep = (n) => new Promise((resolve)=> setTimeout(resolve, n* 1000))
  
  const city = 'F'
  const town = pad(1, 2)          //01
  const section = pad(403, 4)     //0403
  for(let i=100; i<500; i++){
    const landbuild = pad(i, 5)   //00100
    const result=  await natApi.innerRequest(city, town, section, landbuild, cookies)
    if(result.includes('<<查詢結果>>OK<</查詢結果>>')) console.log('Good')
    else require('fs').writeFileSync(`./${city}_${town}_${section}_${landbuild}_${new Date().getTime()}.txt`, result)

    await sleep(3)
  }
})()

