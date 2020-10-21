import util from '../../utils/util.js'

const app = getApp()

var view = undefined
function setup(v) {
  view = v
}

function onUnload() {
  view = undefined
}

function onLoad(options) {
  var topic = app.globalData.tags
  view.setData({ topic: { items: topic, selected: -1}})
  view.setData({ showVideo: videoSupport()})
}

function clearInput(keep) {
  if (keep != 'images') {
    view.setData({ images: [] })
  }
  if (keep != 'video') {
    view.setData({ video: {} })
  }
  
}

// tags and location
function onClickTag(e) {
  var idx = e.target.dataset.idx;
  var topic = view.data.topic
  if (topic.selected == idx) {
    topic.selected = -1
  } else {
    topic.selected = idx
  }
  view.setData({ topic: topic })
}

function onClickLocation(e) {
  wx.chooseLocation({
    success: function (res) {
      var showname = res.name
      var city = util.getCityName(res.address)
      if (city) {
        showname = city + '·' + res.name
      }
      var location = {
        name: showname,
        address: res.address,
        lat: res.latitude,
        lng: res.longitude,
      }
      view.setData({ location: location })
      
    },
  })
}

function onDeleteLocation(e) {
  console.log("delete location...")
  view.setData({ location: {} })
}

// images
function onChooseImage(e) {
  var left = 9 - view.data.images.length
  wx.chooseImage({
    count: left,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: function (res) {
      if (res.tempFilePaths.length > 0) {
        clearInput("images")
        addNewImage(res.tempFilePaths)
      }
    },
  })
}

function addNewImage(images) {
  var array = view.data.images
  array = array.concat(images)
  view.setData({ images: array })
}

function onClickImage(e) {
  var index = e.currentTarget.dataset.idx
  var images = view.data.images
  wx.previewImage({
    urls: images,
    current: images[index],
  })
}

function onDeleteImage(e) {
  var index = e.currentTarget.dataset.idx
  var images = view.data.images
  images.splice(index, 1)
  view.setData({images: images})
}

// video
function videoSupport() {
  if (app.globalData.meta && app.globalData.meta.app_video) {
    return true
  }
  return false
}

function onChooseVideo() {
  wx.chooseVideo({
    sourceType: ['album', 'camera'],
    maxDuration: 60,
    camera: 'back',
    success(res) {
      console.log(res)
      clearInput("video")
      res.src = res.tempFilePath
      res.cover = res.thumbTempFilePath
      console.log("get cover:", res)
      view.setData({ video: res })
    }
  })
}

function onClickVideo() {
  console.log("click video..")
}

function onClickDeleteVideo() {
  view.setData({ video: {} })
}

function hasContent() {
  if (!util.isWhiteSpace(view.data.content)) {
    return true
  }
  if (view.data.images.length > 0) {
    return true
  }
  if (view.data.video.src) {
    return true
  }
  return false
}






module.exports = {
  setup: setup,
  onLoad: onLoad,
  onUnload: onUnload,
  
  // image
  onChooseImage: onChooseImage,
  onClickImage: onClickImage,
  onDeleteImage: onDeleteImage,

  // video
  onChooseVideo: onChooseVideo,
  onClickVideo: onClickVideo,
  onClickDeleteVideo: onClickDeleteVideo,

  // location
  onClickLocation: onClickLocation,
  onDeleteLocation: onDeleteLocation,

}