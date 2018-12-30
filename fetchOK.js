(async function(){
  const fs = require('fs')
  const s3 = require('./lib/s3')
  const apis = require('./apis/fetch')

  const cityCode = 'A', townCode = 'A02', sectCode = '0228', landBuild = 555
  const res = (await apis.cmd({cityCode, townCode, sectCode, landBuild}))

  const {W, filePath} = JSON.parse(res)

  const res2 = await apis.getResult(W, filePath)
  const html = await res2.text()

  console.log(html)

  if(!html.includes('錯誤')) {
    const fileName = `${cityCode}_${townCode}_${sectCode}_${landBuild}.html`
    console.log('[INFO] Good HTML content, going to upload to S3: ', fileName)
    const bucket = 'zhengdao'
    await s3.uploadByData({data: html, fileName, bucket})
  }
})()
