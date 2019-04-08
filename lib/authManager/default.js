const Base = require('./base')
const authDao = require('../../db/auth/dao')

class AuthManager extends Base {
  constructor(task){
    super(task)
  }
  fetchAuthDao(){
    return authDao.findOne({status : 'available'})
  }
  dropAuthDao(id){
    return authDao.update({status : 'unavailable'}, {id})
  }
}

module.exports = AuthManager