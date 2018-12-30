const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_KEY_SECRET,
    region: 'ap-northeast-1'
})

const initS3 = () =>
  new AWS.S3({
    signatureVersion: 'v4'
  })

const initSqs = () =>
   new AWS.SQS({ apiVersion: '2012-11-05' })

module.exports = {
  initS3,initSqs
}
