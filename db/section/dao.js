const Section = require('./model')
const Schema = require('./schema')

const DaoBase = require('../DaoBase')

const dao = new DaoBase({
  model: Section,
  schema: Schema
})

module.exports = dao