const s3 = require('../../lib/s3')

describe('storage', async ()=>{
    const fileName = 'package.json'
    const bucket = process.env.S3_BUCKET

    afterAll(async ()=> {
        return await s3.deleteObject({Key: fileName, bucket})
    })
    it('upload', async ()=>{
        const filePath = `./${fileName}`
        const result = await s3.uploadByFile({filePath, bucket})
        expect(result.includes('https')).toBe(true)
        const headers = require("downloadable")(result)
        expect(headers).not.toBeNull()
    })
    it('listFile', async ()=>{
        const filePath = ''
        const result = await s3.listFile({filePath, bucket})

        const {Contents} = result
        const item = Contents.find( item => item.Key === fileName)
        expect(item).not.toBeNull()
    })
})

describe('storage', async ()=>{
    const fileName = 'test.txt'
    const bucket = process.env.S3_BUCKET

    afterAll(async ()=> {
        return await s3.deleteObject({Key: fileName, bucket})
    })
    it('uploadByData', async ()=>{
        const data = `I am  peter`
        const result = await s3.uploadByData({data, fileName, bucket})
        expect(result.includes('https')).toBe(true)

        const headers = require("downloadable")(result)
        expect(headers).not.toBeNull()
    })
    it('listFile', async ()=>{
        const filePath = ''
        const result = await s3.listFile({filePath, bucket})

        const {Contents} = result
        const item = Contents.find( item => item.Key === fileName)
        expect(item).not.toBeNull()
    })
})