const b64 = require('b64.js')

const formatTime = date => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()

  return [month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const prettyTime = date => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  return month + '月' + day + '日 ' + [hour, minute].map(formatNumber).join(':')
}

const prettyTimeYMD = date => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  return month + '月' + day + '日 '
}


const minute = 1000 * 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const halfamonth = day * 15;
const month = day * 30;

const agoTime = dateTimeStamp => {
  var now = new Date().getTime();
  var diffValue = now - dateTimeStamp;
  var v = 0
  var result = ""
  if ((v = diffValue/month) >= 1) {
    if (v >= 3) {
      result = "3 个月前"
    } else {
      result = "" + (v|0) + " 月前"
    }
  } else if ((v = diffValue/week) >= 1) {
    result = "" + (v|0) + " 周前"
  } else if ((v = diffValue/day) >= 1) {
    result = "" + (v|0) + " 天前"
  } else if ((v = diffValue/hour) >= 1) {
    result = "" + (v|0) + " 小时前"
  } else if ((v = diffValue/minute) >= 1) {
    result = "" + (v|0) + " 分钟前"
  } else {
    result = "刚刚"
  }
  return result
}

const msgTime = (date) => {
  const month = date.getMonth() + 1
  const _day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()

  var now = new Date().getTime();
  var diffValue = now - date;
  if (diffValue/day >= 1) {
    return [month, _day].map(formatNumber).join('-')
  } else {
    return [hour, minute].map(formatNumber).join(': ')
  }
}

const getDaysFromNow = (created_at) => {
  var thatTime = new Date(created_at * 1000)
  var nowTime = new Date()
  return Math.ceil((nowTime - thatTime) / (1000 * 3600 * 24))
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 从当前页面传递数据到上一个页面
function setResult(data) {
  const pages = getCurrentPages();
  if (pages.length >= 2) {
    const prevPage = pages[pages.length - 2]  //上一个页面
    if (prevPage.onResult) {
      prevPage.onResult(data)
    }
  }
}

// 从当前页面发送数据到目的页面，使用全局变量实现
// 需要用 getTransitData 方法提取
function setTransitData(key, value) {
  var g = getApp().globalData
  g.transit[key] = value
}

function getTransitData(key) {
  var g = getApp().globalData
  var v = g.transit[key]
  g.transit[key] = null
  return v
}

function jwtDecode(token) {
  var base64 = token.split('.')[1];
  var b = b64.atob(base64)
  return JSON.parse(b)
}

// check to see if the user token is expired or
// will expire within the next 30 minutes (1800 seconds).
// If not, there is nothing we really need to do here.
function jwtExpire(token, ahead) {
  if (!ahead) {
    ahead = 1800
  }
  if (Date.now()/1000 < jwtDecode(token).exp - ahead) {
    return false
  } 
  return true
}

// hashtag
function hashtag(text) {
  var regex = /#[^#]+#/g
  if (text) {
    return text.match(regex)
  }
  return null
}

// Test white space
// Instead of checking the entire string to see if there's only whitespace, 
// just check to see if there's at least one character of non whitespace:
function isWhiteSpace(str) {
  return !str || (!/\S/.test(str))
}

// Parse json
function jsonParse(str) {
  var r = {}
  try {
    r.object = JSON.parse(str)
    r.ok = true
  } catch (e) {
    r.ok = false
    r.err = e
  }
  return r
}

// update list item
function getCityName(addr) {
  var city = undefined
  if (addr) {
    console.log("get add:" + addr)
    var index0 = addr.indexOf('省')
    var index1 = addr.indexOf('市')
    if (index0 > 0 && index1 > 0 && index1 > index0 ) {
      city = addr.substring(index0+1, index1+1)
    } else if (addr.includes('北京市')) {
      city = '北京市'
    } else if (addr.includes('上海市')) {
      city = '上海市'
    } else if (addr.includes('天津市')) {
      city = '天津市'
    } else if (addr.includes('重庆市')) {
      city = '重庆市'
    }
  }
  return city
}

function lightenColor(col, amt) {
  if (col[0] == "#") {
    col = col.slice(1);
  }

  var num = parseInt(col, 16);
  var r = (num >> 16) + amt;
  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  var b = ((num >> 8) & 0x00FF) + amt;
  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  var g = (num & 0x0000FF) + amt;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return "#" + padZero(r.toString(16)) + padZero(b.toString(16)) + padZero(g.toString(16));
}

function alphaColor(col, amt) {
  if (col[0] == "#") {
    col = col.slice(1);
  }
  var num = parseInt(col, 16);
  var r = (num >> 16);
  var g = ((num >> 8) & 0x00FF);
  var b = (num & 0x0000FF);
  return `rgba(${r}, ${g}, ${b}, ${amt})`
}

function invertColor(hex, bw) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    // http://stackoverflow.com/a/3943023/112731
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186
      ? '#000000'
      : '#ffffff';
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  return "#" + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}

module.exports = {
  formatTime: formatTime,
  agoTime: agoTime,
  msgTime: msgTime,
  prettyTime: prettyTime,
  prettyTimeYMD: prettyTimeYMD,
  getDaysFromNow: getDaysFromNow,
  setResult: setResult,
  sendRequest: setTransitData,
  getRequest: getTransitData,
  jwtDecode: jwtDecode,
  jwtExpire: jwtExpire,
  hashtag: hashtag,
  isWhiteSpace: isWhiteSpace,
  jsonParse: jsonParse,
  getCityName: getCityName,
  lightenColor: lightenColor,
  invertColor: invertColor,
  alphaColor: alphaColor,
}
