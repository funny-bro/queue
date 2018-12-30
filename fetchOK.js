(async function(){
  const fs = require('fs')
  const s3 = require('./lib/s3')
  const apis = require('./apis/fetch')

  const cityCode = 'F', townCode = 'F05', sectCode = '1787', landBuild = 303, project = '0B'
  const res = (await apis.cmd({cityCode, townCode, sectCode, landBuild, project}))

  const {W, filePath} = JSON.parse(res)

  const res2 = await apis.getResult(W, filePath)
  const html = await res2.text()

  console.log(html)

  if(!html.includes('錯誤')) {
    const fileName = `${cityCode}_${townCode}_${sectCode}_${landBuild}.html`
    console.log('[INFO] Good HTML content, going to upload to S3: ', fileName)
    const bucket = process.env.S3_BUCKET
    await s3.uploadByData({data: html, fileName, bucket})
  }
})()
