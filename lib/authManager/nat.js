const Base = require('./base')
const authDao = require('../../db/auth/dao')

class AuthManager extends Base {
  constructor(task){
    super(task)
  }
  fetchAuthDao(){
    return authDao.findOne({statusNat : 'available'})
  }
  dropAuthDao(id){
    return authDao.update({statusNat : 'unavailable'}, {id})
  }
}

module.exports = AuthManager