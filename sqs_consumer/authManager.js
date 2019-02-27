const authDao = require('../db/auth/dao')

// const processConsumber = async (task, isReset) => {
//   const authObj =  await authDao.findOne({status : 'available'})
//   const {enuid = '', ensid = '', cookieValue = '', id= ''} = authObj

//   if(!authObj) process.exit()
  
//   try {
//     return task({enuid, ensid, cookieValue, authObj})  
//   }
//   catch(err){
//     console.log('[ERROR] authManager',JSON.stringify(err))
//     // if(err.isResetAuth) { isReset = true}
//   }

//   if(isReset) {
//     await authDao.update({status : 'unavailable'}, {})
//   }

//   return processConsumber()
// }

class AuthManager {
  constructor(task){
    this.task = task
    this.authObj = null
    this.enuid = null
    this.ensid = null
    this.cookieValue = null
    this.id = null
  }

  async init(){
    const authObj =  await authDao.findOne({status : 'available'})
    if(!authObj) {
      console.log('[DONE] no any authObj is available')
      return process.exit()
    }
    
    const {enuid = '', ensid = '', cookieValue = '', id= '', username = ''} = authObj
    console.log('[INFO] auth Obj is :', username)
    this.authObj = authObj
    this.enuid = enuid
    this.ensid = ensid
    this.cookieValue = cookieValue
    this.id = id
  }

  async process(){
    const {enuid, ensid, cookieValue} = this
    return this.task({enuid, ensid, cookieValue})
  }

  async dropCurrentAuthAndRenew(){
    const {id} = this
    await authDao.update({status : 'unavailable'}, {id})
    await this.init()
    return 
  }
}

module.exports = AuthManager