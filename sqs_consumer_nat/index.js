(async function(){
  const AuthMag = require('../lib/authManager/nat')
  const sqsConsumerTask = require('./sqs_consumer')
  const historyDao = require('../db/history/dao')

  const am = new AuthMag(sqsConsumerTask)

  // const am = new AuthMag(function(a,b,c){
  //   console.log(' --=-=-=-')
  //   console.log(a,b,c)
  // })

  const main = async () => {
    try {
      await am.init()
      console.log('[INFO] nat/index cfid:   ', am.cfid)
      console.log('[INFO] nat/index cftoken:', am.cftoken)
      await am.process()
      process.exit()
    }
    catch(err){
      if(err.count) {
        await historyDao.create({type: 'consumerNat', count: err.count})
        console.log(`[INFO] updated history: count: ${err.count}`)
      }
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