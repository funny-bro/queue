const authDao = require('../db/auth/dao')

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
    this.cookieName = process.env.COOKIE_NAME
    this.domain = process.env.LOGIN_ENTRY
  }

  async process(){
    const {enuid, ensid, cookieValue, cookieName, domain} = this
    return this.task({enuid, ensid, cookieValue, cookieName, domain})
  }

  async dropCurrentAuthAndRenew(){
    const {id} = this
    await authDao.update({status : 'unavailable'}, {id})
    await this.init()
    return 
  }
}

module.exports = AuthManager