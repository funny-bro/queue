(async function(){
  const AuthMag = require('../lib/authManager/default')
  const sqsConsumerTask = require('./sqs_consumer')

  const am = new AuthMag(sqsConsumerTask)

  const main = async () => {
    try {
      await am.init()
      await am.process()
      process.exit()
    }
    catch(err){
      if(err.isResetAuth) {
        await am.dropCurrentAuthAndRenew()
        await main()
        return
      }
  
      console.log('[ERROR] unexpected error : ', err)
      return
    }
  }

  await main()
  console.log('[Done] main')
})()