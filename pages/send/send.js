// pages/send/send.js
const ctr = require('./controller.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: {
      color: '#1890FF',
      tabColor: '#333' || '#20ACAB',
    },
    navH: 0,
    title: "",
    content: "",
    location: "",
    images: [],
    video:{},
    topic: {
      items: [],
      selected: -1,
    },
    showAdd: false,
    showDialog: false,
    showVideo: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    ctr.setup(this);
    ctr.onLoad(options);
    this.setData({
      navH: app.globalData.navHeight
    });
    console.log(this.data.topic)
  },
  onUnload: function () {
    ctr.onUnload()
  },

  bindTitle: function(e) {
    this.setData({title: e.detail.value})
  },
  bindContent: function(e) {
    this.setData({content: e.detail.value})
  },
  writerPublish: function() {
    biz.subscribe("new-post", () => {
      ctr.onClickSubmit()
    })
  },
  clickVideo: ctr.onClickVideo,
  chooseImage: ctr.onChooseImage,
  clickImage: ctr.onClickImage,
  clickDelete: ctr.onDeleteImage,
  clickDeleteVideo: ctr.onClickDeleteVideo,
  writerCancel: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  clickTag: function(e) {
    ctr.onClickTag(e)
  }, 
  clickLocation: function(e) {
    ctr.onClickLocation(e)
    
  },
  clickDeleteLocation: function(e) {
    ctr.onDeleteLocation(e)
  },
  chooseImage: ctr.onChooseImage,
  chooseVideo: ctr.onChooseVideo,

  onRequestClose: function() {
    this.setData({ showDialog: false})
  },

  onDialogSubmit: function(e) {
    ctr.onSubmitLink(e)
  }

})