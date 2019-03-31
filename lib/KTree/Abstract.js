
class AbstractTree {
  constructor(data = {}, parent = null){
    this.data = {...data}
    this.childItems = {}
    this.childIdList = []
    this.parent = parent
    this.countChild = 0
    this.countSubChild = 0
  }
  update(data){
    return this.data = {
      ...this.data,
      ...data
    }
  }
  getParent(){
    return this.parent
  }
  getChild(id = ''){
    return this.childItems[id]
  }
  countChildAdd(n) {
    this.countChild += n 
    if(this.parent)
      return this.parent.countSubChildAdd(n)
  }
  countSubChildAdd(n) {
    this.countSubChild += n 
    if(this.parent)
      return this.parent.countSubChildAdd(n)
  }
  appendChild(id, childTree) {
    this.countChildAdd(1)
    this.childItems[id] = childTree
    this.childIdList.push(id)
    return
  }
  prepareJson(){
    const { countChild, countSubChild, data} = this
    return {
      ...data,
      countChild,
      countSubChild,
    }
  }
  getJson(isIncludedSub){
    const {childIdList, childItems} = this
    const current = this.prepareJson()
    
    if(!isIncludedSub) return current

    current.child = {}
    childIdList.forEach(childId => {
      current.child[childId] = childItems[childId].getJson(isIncludedSub)
    })
    return current
  }
}

module.exports = AbstractTree