
const parserTown = (item) => {
  const { code: id, title } = item
  return { id, title, type: 'town' }
}
const parserSection = (item) => {
  const { value: id, text: title } = item
  return { id, title, type: 'section' }
}

const cityCodeArray = ['F', 'H', 'A']
const AbstractTree = require('../../lib/KTree/Abstract')

const init = () => {
  const root = new AbstractTree({type: 'root'}, null)

  for (let i = 0; i < cityCodeArray.length; i++) {
    const cityCode = cityCodeArray[i]
    const currentCityNode = new AbstractTree({type: 'city'}, root)
    root.appendChild(cityCode, currentCityNode)
  
    for (const townItem of require(`../../temp/town_${cityCode}.json`)) {
      const townData = parserTown(townItem)
      const { id: townCode, title } = townData
      const currentTownNode = new AbstractTree(townData, currentCityNode)
      currentCityNode.appendChild(townCode, currentTownNode)
  
      for (const sectItem of require(`../../temp/section_${cityCode}_${townCode}.json`)) {
        const sectionData = parserSection(sectItem)
        const { id: sectionCode, title } = sectionData
        const currentSectionNode = new AbstractTree(sectionData, currentTownNode)
        currentTownNode.appendChild(sectionCode, currentSectionNode)
      }
    }
  }
  
  return root
}

module.exports = {init}