const Auth = require('./model')
const Schema = require('./schema')
const DaoBase = require('../DaoBase')

const dao = new DaoBase({
  model: Auth,
  schema: Schema
})

module.exports = dao