(async function(){
  const natApi = require('./lib/natApi')
  const {pad} = require('./lib/string')

  const CFID = '587869'
  const CFTOKEN = '47088726'

  console.log('CFID: ', CFID)
  console.log('CFTOKEN: ', CFTOKEN)
  
  const cookies = {CFID, CFTOKEN}

  const sleep = (n) => new Promise((resolve)=> setTimeout(resolve, n* 1000))
  
  const dataList = [
    {cityCode : 'F', townCode : 'F05', sectCode : '1787', landBuild : 305, project : '0B'},
    {cityCode : 'F', townCode : 'F05', sectCode : '1787', landBuild : 303, project : '0B'},
    {cityCode : 'F', townCode : 'F14', sectCode : '0165', landBuild : 321, project : '0B'},
    {cityCode : 'F', townCode : 'F14', sectCode : '0165', landBuild : 303, project : '0B'},
    {cityCode : 'H', townCode : 'H06', sectCode : '0810', landBuild : 222, project : '0B'}, // multiple result
    {cityCode : 'F', townCode : 'H06', sectCode : '1906', landBuild : 222, project : '0B'}, // multiple result
    {cityCode : 'F', townCode : 'F18', sectCode : '1860', landBuild : 53, project : '0B'},
  ]
  
  for(let i =0 ;i<dataList.length; i++){
    const {cityCode, townCode, sectCode, landBuild, project} = dataList[i]
    const city = cityCode
    const town = townCode
    const _landBuild = pad(landBuild, 5)   //00100
    const result=  await natApi.innerRequest(city, town, sectCode, _landBuild, cookies)

    // fail condition 1
    if(result.includes('<<查詢結果>>error<</查詢結果>>')) {
      console.log('[INFO] empty landBuild')
    }
    // fail condition 1
    if(result.includes('未取得使用授權而欲進入本系統')) {
      console.log('[INFO] 未取得使用授權而欲進入本系統')
    }

    if(result.includes('<table class="cfdump_struct">')){
      console.log('[INFO] <table class="cfdump_struct">')
    }

    if(!result)  {
      console.log('[INFO] null result')
    }

    if(result.includes('<<查詢結果>>OK<</查詢結果>>')) {
      console.log(' -=-=-=- good -=-=-= includes ＊', result.includes('＊'))
    }

    require('fs').writeFileSync(`./${city}_${town}_${sectCode}_${_landBuild}_${new Date().getTime()}.txt`, result)

    await sleep(3)
  }
})()

