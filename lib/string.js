const onlyCharDigit = (str = '') => {
  return str.replace(/[^a-zA-Z]/g, "")
}

const urlFileName = (url = '') => {
  return url.substring(url.lastIndexOf('/')+1);
}

const urlDomain = (url = '') => {
  const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  return matches && matches[1];
}

const pad = (num, size) => {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}

module.exports ={
  onlyCharDigit,
  urlFileName,
  urlDomain,
  pad
}