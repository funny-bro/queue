(async function(){
  const {fetchLandBuild} = require('./lib/fetchSingleData')
  const sleep = (second = 3) =>
    new Promise(resolve => setTimeout(() => resolve(), second * 1000))
    
  const dataList = [
    {cityCode : 'F', townCode : 'F05', sectCode : '1787', landBuild : 305, project : '0B'},
    {cityCode : 'F', townCode : 'F05', sectCode : '1787', landBuild : 303, project : '0B'},
    {cityCode : 'F', townCode : 'F14', sectCode : '0165', landBuild : 321, project : '0B'},
    {cityCode : 'F', townCode : 'F14', sectCode : '0165', landBuild : 303, project : '0B'},
    {cityCode : 'H', townCode : 'H06', sectCode : '0810', landBuild : 222, project : '0B'}, // multiple result
  ]
  
  // const uid = process.env.ENUID
  // const sid = process.env.ENSID
  // const cookieValue = process.env.COOKIE_VALUE
  const uid ='ZmNDTGVGK04xTVdPQVBHdmVNblhXUT09'
  const sid = 'd1JsUkExVWhFaFlTcSs2RURHR1k0UT09'
  const cookieValue = '388205301EFB8B37D1CD09BB0CEB89A8'

  const authConfig = {uid, sid, cookieValue}

  for(let i =0 ;i<dataList.length; i++){
    try {
      const {cityCode, townCode, sectCode, landBuild, project} = dataList[i]
      const response = await fetchLandBuild(cityCode, townCode, sectCode, landBuild, project, authConfig)

      if(response.html && response.json) {
        console.log('good', JSON.stringify(response.json))
      }

      if(!response.html || !response.json) {
        console.log('bad')
      }

      await sleep(0.5)
    }
    catch(err){
      console.error(err)
    }
  }

})()
