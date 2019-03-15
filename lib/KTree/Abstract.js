
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
  getJson(isIncludedSub){
    const { countChild, countSubChild, data, childIdList, childItems} = this
    const current = {
      ...data,
      countChild,
      countSubChild,
    }

    if(!isIncludedSub) return current

    current.child = {}
    childIdList.forEach(childId => {
      current.child[childId] = childItems[childId].getJson(isIncludedSub)
    })
    return current
  }
}

module.exports = AbstractTree