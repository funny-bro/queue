const Abstract = require('./Abstract')
class LandBuildTree extends  Abstract{
  constructor(data = {}, parent = null){
    super(data, parent)
    this.landBuildMax = 0
    this.landBuildVal = 0
  }
  update(data = {}){
    const {landBuildMax = 0 , landBuildVal = 0} = data

    if(landBuildMax) this.iteratorAdd('landBuildMax', landBuildMax)
    if(landBuildVal) this.iteratorAdd('landBuildVal', landBuildVal)

    return super.update(data)
  }
  prepareJson(){
    const { countChild, countSubChild, data, landBuildMax, landBuildVal} = this
    return {
      ...data,
      landBuildMax,
      landBuildVal,
      countChild,
      countSubChild,
    }
  }
  iteratorAdd(field, n) {
    this[field] += n 
    if(this.parent)
      return this.parent.iteratorAdd(field, n)
  }
}

module.exports = LandBuildTree