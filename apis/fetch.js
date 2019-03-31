const fetch = require('./initFetch')
const rawRequest = require('./rawRequest');
const querystring = require("querystring");

const cookieName = process.env.COOKIE_NAME
const cookieValue = process.env.COOKIE_VALUE
const domain = process.env.LOGIN_ENTRY
const qid = process.env.ENSID
const uid = process.env.ENUID

const serialize = (obj) => {
  const keys = Object.keys(obj)
  const str = ''

  return keys.reduce((accumulator, key)=>{
    return accumulator + `${key}=${obj[key]}&`
  }, '')
}

const city = () => {
  return fetch(`https://${domain}/SetZip_cityList`, {"credentials":"include","headers":{"accept":"application/json, text/javascript, */*; q=0.01","accept-language":"en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7","content-type":"application/x-www-form-urlencoded; charset=UTF-8","x-requested-with":"XMLHttpRequest"},"referrer":`https://${domain}/Home`,"referrerPolicy":"no-referrer-when-downgrade","body":"select_id=hlink1","method":"POST","mode":"cors"})
}

const town = (cityCode) => {
  return fetch(`https://${domain}/SetZip_townList`, {"credentials":"include","headers":{"accept":"application/json, text/javascript, */*; q=0.01","accept-language":"en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7","content-type":"application/x-www-form-urlencoded; charset=UTF-8","x-requested-with":"XMLHttpRequest"},"referrer":`https://${domain}/Home`,"referrerPolicy":"no-referrer-when-downgrade","body":`city_code=${cityCode}`,"method":"POST","mode":"cors"});
}

const section = (cityCode, townCode) => {
  return fetch(`https://${domain}/SetZip_sectList`, {"credentials":"include","headers":{"accept":"application/json, text/javascript, */*; q=0.01","accept-language":"en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7","content-type":"application/x-www-form-urlencoded; charset=UTF-8","x-requested-with":"XMLHttpRequest"},"referrer":`https://${domain}/Home`,"referrerPolicy":"no-referrer-when-downgrade","body":`city_code=${cityCode}&town_code=${townCode}`,"method":"POST","mode":"cors"});
}

// special case,
// html post request
const cmd = (payload) => {
  const {cityCode, townCode, sectCode, landBuild, project = '05'} = payload
  const headers = {
      'Origin': `https://${domain}`,
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Referer': `https://${domain}/Home`,
      'X-Requested-With': 'XMLHttpRequest',
      'Connection': 'keep-alive',
      'Cookie': `${cookieName}=${cookieValue}`
  };

  const dataString = `project=${project}&city=${cityCode}&town=${townCode}&sectno=${sectCode}&landbuild=${landBuild}&code=&sn_type=onwer&qry_cl=2&menu_cl=2&uid=${uid}&qid=${qid}`;

  const options = {
      url: `https://${domain}/Cmd_getCmd`,
      method: 'POST',
      headers: headers,
      body: dataString
  };
  
  return rawRequest(options)
}

const sendData = (w,id,userId,project,isQry,isMessage) => {
  if(!w || !id || !userId || !project || !isQry || !isMessage) throw new Error(`missing w or filePath in sendData w=${w}, id=${id},project=${project},isQry=${isQry},isMessage=${isMessage},`)

  return fetch(`https://${domain}/SendData.servlet?W=${w}&ID=${id}&USERID=${userId}&PROJECT=${project}&rec=$&is_qry=${isQry}&is_message=${isMessage}&filePath=&auth=`, { "credentials": "include", "headers": { "accept": "*/*", "accept-language": "en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7", "x-requested-with": "XMLHttpRequest" }, "referrer": `https://${domain}/Home`, "referrerPolicy": "no-referrer-when-downgrade", "body": null, "method": "GET", "mode": "cors" });
}

const recordToRecord = (w, filePath) => {
  if(!w || !filePath) throw new Error(`missing w or filePath in recordToRecord w=${w}, filePath=${filePath}`)

  const headers = {
    'Origin': `https://${domain}`,
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Referer': `https://${domain}/Home`,
    'X-Requested-With': 'XMLHttpRequest',
    'Connection': 'keep-alive',
    'Cookie': `${cookieName}=${cookieValue}`
  };

  const dataString = querystring.stringify({
    w, 
    file_path: filePath,
    now_charge: 0,
    qid
  })
  
  const options = {
      url: `https://${domain}/Record_toRecord`,
      method: 'POST',
      headers: headers,
      body: dataString
  };

  return rawRequest(options)
}

const getResult = (W, filePath) => {
  return fetch(`https://${domain}/result_getResult`, { "credentials": "include", "headers": { "accept": "*/*", "accept-language": "en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "x-requested-with": "XMLHttpRequest" }, "referrer": `https://${domain}/Home`, "referrerPolicy": "no-referrer-when-downgrade", "body": `file_path=${filePath}&w=${W}`, "method": "POST", "mode": "cors" })
}

module.exports = {city, town, section, cmd, sendData, getResult, recordToRecord}


