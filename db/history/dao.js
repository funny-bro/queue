const History = require('./model')
const Schema = require('./schema')
const DaoBase = require('../DaoBase')

const dao = new DaoBase({
  model: History,
  schema: Schema
})

module.exports = dao