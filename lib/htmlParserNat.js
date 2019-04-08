const parser =(html) => {
  let startIndex = html.indexOf('<<建號>>') + '<<建號>>'.length
  let endIndex = html.indexOf('<</建號>>')

  const buildId = html.substring(startIndex,endIndex).split(' ')[3]

  startIndex = html.indexOf('<<他項權資料>>') + '<<他項權資料>>'.length
  endIndex = html.indexOf('<</他項權資料>>')

  const data = html.substring(startIndex,endIndex).split(/\r\n|\n|\r/)

  let dataJson = []
  
  for(let i = 0; i<data.length-1; i++) {
    const str = data[i]
    if(str === '' || str.length === 1) continue

    let obj = {
      'order': str.split(',')[0],
      'name': str.split(',')[1],
    }
    dataJson.push(obj);
  }

  return dataJson
}

module.exports = {parser}