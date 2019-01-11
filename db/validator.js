
const Validator = require('jsonschema').Validator;

module.exports = (payload, Schema) => {
  const validation = (new Validator()).validate(payload, Schema)

  if(validation.errors.length > 0) {
    const err = {}
    err.validations = validation.errors.reduce((obj, item) => {
      let message = item.message
      if (/(match pattern)|(conform to the.+format)/.test(message)) message = 'incorrect format'
      obj[item.property.match(/\.(.+)$/)[1]] = message
      return obj
    }, {})
    throw err
  }

  return null
}