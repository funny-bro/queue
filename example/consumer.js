(async function(){
  const sleep = (second = 3) =>
  new Promise(resolve => setTimeout(() => resolve(), second * 1000))

  for(let i=0;i <100; i++){

    const {receiveMessage, deleteMessage} = require('../lib/sqs.js')
    const recieveResponse = await receiveMessage(process.env.SQS_URL)
    const { Body, ReceiptHandle } = recieveResponse.Messages[0]

    console.log('Body: ', Body)
    // console.log('ReceiptHandle: ', ReceiptHandle)

    await sleep(3)

    await deleteMessage(process.env.SQS_URL, ReceiptHandle)
  }
})()
