const SectionModel = require('./model')
const Schema = require('./schema')

const DaoBase = require('../DaoBase')

const dao = new DaoBase({
  model: SectionModel,
  schema: Schema
})

module.exports = dao