
const parserTown = (item) => {
  const { code: id, title } = item
  return { id, title, type: 'town' }
}
const parserSection = (item) => {
  const { value: id, text: title } = item
  return { id, title, type: 'section' }
}

const cityCodeArray = ['F', 'H', 'A']
const LandBuildTree = require('../../lib/KTree/LandBuild')

const init = () => {
  const root = new LandBuildTree({type: 'root'}, null)

  for (let i = 0; i < cityCodeArray.length; i++) {
    const cityCode = cityCodeArray[i]
    const currentCityNode = new LandBuildTree({type: 'city'}, root)
    root.appendChild(cityCode, currentCityNode)
  
    for (const townItem of require(`../../temp/town_${cityCode}.json`)) {
      const townData = parserTown(townItem)
      const { id: townCode, title } = townData
      const currentTownNode = new LandBuildTree(townData, currentCityNode)
      currentCityNode.appendChild(townCode, currentTownNode)
  
      for (const sectItem of require(`../../temp/section_${cityCode}_${townCode}.json`)) {
        const sectionData = parserSection(sectItem)
        const { id: sectionCode, title } = sectionData
        const currentSectionNode = new LandBuildTree(sectionData, currentTownNode)
        currentTownNode.appendChild(sectionCode, currentSectionNode)
      }
    }
  }
  
  return root
}

module.exports = {init}