const { initS3 } = require('./aws')
const s3 = initS3()

const BUCKET_NAME = process.env.AWS_BUCKET_NAME

const getFile = (filePath, isStreaming) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: filePath
  }

  if (isStreaming) return s3.getObject(params).createReadStream()

  return s3.getObject(params).promise()
}

const deleteObject = ({Key, bucket}) => {
  const payload = {
    Bucket: bucket,
    Key,
  }
  return s3.deleteObject(payload).promise()
}
const listFile = ({filePath, bucket}) => {
  const params = {
    Bucket: bucket,
    Prefix: filePath || ''
  }

  return s3.listObjectsV2(params).promise()
}

const uploadByFile = async ({filePath, bucket, folder}) => {
  const Body = require('fs').readFileSync(filePath)
  const filename = require('path').basename(filePath)

  const Key = folder? `${folder}/${filename}` : filename

  const payload = {
    Bucket: bucket,
    Key,
    Body,
    ACL: 'public-read'
  }
  const res = await s3.upload(payload).promise()
  return res.Location
}

const uploadByData = async ({data, fileName, bucket}) => {
  const payload = {
    Bucket: bucket,
    Key: fileName,
    ContentType:'binary',
    ACL: 'public-read',
    Body: Buffer.from(data, 'utf8')
  }
  await s3.putObject(payload).promise()
  return `https://s3-ap-northeast-1.amazonaws.com/${bucket}/${fileName}`
}

module.exports = { getFile, listFile, uploadByFile, uploadByData, deleteObject }
