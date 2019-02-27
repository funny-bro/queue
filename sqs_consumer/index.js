(async function(){
  const AuthMag = require('./authManager')
  const sqsConsumer = require('./sqs_consumer')

  const am = new AuthMag(sqsConsumer)

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