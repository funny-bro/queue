class AuthManagerBase {
  constructor(task){
    this.task = task
    this.authObj = null
    this.uid = null
    this.sid = null
    this.cfid = null
    this.cftoken = null
    this.cookieValue = null
    this.id = null
  }

  fetchAuthDao(){
    // return authDao.findOne({status : 'available'})
    throw 'fetchAuthDao is required to implement'
  }
  dropAuthDao(id){
    // return authDao.update({status : 'unavailable'}, {id})
    throw 'dropAuthDao is required to implement'
  }

  async init(){
    const authObj =  await this.fetchAuthDao()
    if(!authObj) {
      console.log('[DONE] no any authObj is available')
      return process.exit()
    }
    
    const {enuid = '', ensid = '', cookieValue = '', id= '', username = '', cfid= '', cftoken = ''} = authObj
    console.log('[INFO] auth Obj is :', username)
    this.authObj = authObj
    this.uid = enuid
    this.sid = ensid
    this.cookieValue = cookieValue
    this.id = id
    this.cfid = cfid
    this.cftoken = cftoken
    this.cookieName = process.env.COOKIE_NAME
    this.domain = process.env.LOGIN_ENTRY
  }

  async process(){
    const {uid, sid, cookieValue, cookieName, domain, cfid, cftoken} = this
    return this.task({uid, sid, cookieValue, cookieName, domain, cfid, cftoken})
  }

  async dropCurrentAuthAndRenew(){
    const {id} = this
    // await authDao.update({status : 'unavailable'}, {id})
    await this.dropAuthDao(id)
    await this.init()
    return 
  }
}

module.exports = AuthManagerBase