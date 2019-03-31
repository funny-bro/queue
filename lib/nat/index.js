const request = require('request');
const iconv = require('iconv-lite');

const getDataString = (city, town, section, landbuild) => {
  return Object.entries({
    "Admip": city,
    "Admit_sel": town,
    "H_LSec": `${section}`,
    "LSec": `${section}`,
    "Query_Op": "FL",
    "Lid_M": `${landbuild}`,
    "Lid_S": null,
    "Q_type": "2",
    "Order": null,
    "F_ID": null,
    "H_Admip": city,
    "H_Admit": town,
    "H_Lid": `${landbuild}000`,
    "H_Order": null,
    "H_ACT": "FL",
    "H_F_ID": null,
    "H_Admip_Name": "%B7s%A5_%A5%AB",
    "H_Admit_Name": "%B7s%B2%F8%B0%CF",
    "H_LSec_Name": null,
    "H_para": `FL,${town},${section},${landbuild}000,,,+,${landbuild}000,${city}`.replace(',', '%2C'),
    "H_opno": null,
    "H_ID1": null,
    "H_Q_TYPE": "2"
  }).map(e => e.join('=')).join('&');
}

const innerRequest = (city, town, seciton, landbuild, cookies) => {
  const {CFID, CFTOKEN} = cookies
  if(!CFID || !CFTOKEN) throw `[ERROR] innerRequest(). both CFID, CFTOKEN are required ${CFID, CFTOKEN}`
  const headers = {
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0',
    
    'Origin': `https://${process.env.NAT_API_DOMAIN}`,
    'Upgrade-Insecure-Requests': '1',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Referer': `https://${process.env.NAT_API_DOMAIN}/3T/PC/MAIN/Query1.cfm`,
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7',
    'Cookie': `CFID=${CFID}; CFTOKEN=${CFTOKEN}`
  };
  
  const dataString = getDataString(city, town, seciton, landbuild)
  
  console.log(dataString)
  
  const options = {
      url: `https://${process.env.NAT_API_DOMAIN}/3T/PC/MAIN/call.cfm`,
      encoding: null,
      method: 'POST',
      headers: headers,
      body: dataString
  };

  return new Promise((resolve, reject)=>{
    return request(options, (error, response, body) => {
      if(error ) {
        reject(error)
      }
    
      const text = iconv.decode(new Buffer(body), "Big5");
      return resolve(text)
    })
  })
}

module.exports = {
  innerRequest
}
