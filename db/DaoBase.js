const validator = require('./validator')

class DaoBase {
  constructor({model, schema}){
    this.model = model
    this.schema = schema

  }
  create(payload){
    const {model, schema} = this
    const invalid = validator(payload, schema)

    if(invalid) throw new Error(invalid)
      
    return model.sync()
    .then(()=> model.create(payload))
    .then(res => res.dataValues)
  }

  update (payload, condition) {
    const {model} = this
    return model.update(
      payload,
      { where: condition} /* where criteria */
    )
  }

  findOne (condition) {
    const {model} = this
    return model.findOne({ where: condition})
    .then(res => {
      if(!res) return null

      return res.dataValues
    })
  }

  findAndCountAll (condition = {}, options = {}) {
    const {model} = this
    const {limit = 20, offset = 0, isRaw = false} = options
    return model.findAndCountAll({
        where: condition,
        limit,
        offset
    }).then(res => {
      if(!res) return []

      if(isRaw) return res
      
      const {count, rows} = res
      return {
        count,
        data: rows.map(item => item.dataValues)
      }
    })
  }
  
  destroy (condition) {
    const {model} = this
    return model.findOne({ where: condition})
      .then( dataObject => dataObject.destroy())
  }
}


module.exports = DaoBase