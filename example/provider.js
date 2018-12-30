(async function(){
  const {sendMessage,} = require('../lib/sqs.js')
  const messageBody = `msg-${new Date().getTime()}`

  for(let i=0; i< 100; i++){
    console.log('i: ', i)
    await sendMessage(process.env.SQS_URL, messageBody)
  }
})()
