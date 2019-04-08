var Iconv = require('iconv').Iconv;
var iconv = new Iconv('utf8', 'BIG5');

const big5Encode = (chr) => {
  const unescapedCharacters = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_.~"
  let rtn = ""
  let buf = iconv.convert(chr)
  for(var i=0;i<buf.length;i+=2) {
      rtn += '%' + buf[i].toString(16).toUpperCase();

      let str = String.fromCharCode(buf[i+1])

      if(!unescapedCharacters.includes(str)){
          str = '%' + buf[i+1].toString(16).toUpperCase()
      }

      rtn += str
  }
  return rtn;
}

const onlyCharDigit = (str = '') => {
  return str.replace(/[^a-zA-Z]/g, "")
}

const onlyDigit = (str = '') => {
  return str.replace(/\D/g,'');
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
  onlyDigit,
  urlFileName,
  urlDomain,
  pad,
  big5Encode
}