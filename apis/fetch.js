const fetch = require('node-fetch')
const pMg = require('../lib/processManager')

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

const cmd = (options) => {
  const {cityCode, townCode, sectCode, landBuild, project = '05'} = options
  return pMg.execPromise(`curl 'https://${domain}/Cmd_getCmd' -H 'Cookie: ${cookieName}=${cookieValue}' -H 'Origin: https://${domain}' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Referer: https://${domain}/Home' -H 'X-Requested-With: XMLHttpRequest' -H 'Connection: keep-alive' --data 'project=${project}&city=${cityCode}&town=${townCode}&sectno=${sectCode}&landbuild=${landBuild}&code=&sn_type=onwer&qry_cl=2&menu_cl=2&uid=${uid}&qid=${qid}' --compressed`)
}

const getResult = (W, filePath) => {
  return fetch(`https://${domain}/result_getResult`, { "credentials": "include", "headers": { "accept": "*/*", "accept-language": "en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "x-requested-with": "XMLHttpRequest" }, "referrer": "https:/${${domain}}/Home", "referrerPolicy": "no-referrer-when-downgrade", "body": `file_path=${filePath}&w=${W}`, "method": "POST", "mode": "cors" })
}

module.exports = {city, town, section, cmd, getResult}