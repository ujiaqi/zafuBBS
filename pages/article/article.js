// pages/article/article.js

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: 0,
    theme: {
      color: '#1890FF',
      tabColor: '#333' || '#20ACAB',
    },
    topic:{
      sorts:
      ["闲置交易", "表白交友", "疑问互答", "任务兼职",
    "相约学习", "实物招领", "趣事分享"],
    selected:0
    },
    content:"",
    location: "",
    imageList: [],
    video:{},
    anonymous: false
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  bindContent: function(e) {
    this.setData({content: e.detail.value})
  },

  // 清空照片或者图片
  clearInput: function(name){
    if (name != 'imageList') {
      this.setData({ imageList: [] })
    }
    if (name != 'video') {
      this.setData({ video: {} })
    }
  },

  // 选择照片
  chooseImage: function(e){
    var that = this;
    let surplus = 9 - this.data.imageList.length
    wx.chooseImage({
      count: surplus,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res){
        that.clearInput("imageList");
        that.addNewImage(res.tempFilePaths);
        wx.showToast({
          title: '上传成功！',
        })
      }
    })
  },

  addNewImage(imagePath){
    var list = this.data.imageList
    list = list.concat(imagePath)
    this.setData({
      imageList: list
    })
  },

  thisImage:function(e){
    let index = e.currentTarget.dataset.imageid;
    let list = this.data.imageList;
    wx.previewImage({
      urls: list,
      current: list[index]
    })
  },

  deleteImage: function(e){
    let index = e.currentTarget.dataset.imageid;
    let list = this.data.imageList;
    list.splice(index, 1)
    this.setData({
      imageList: list
    })
  },

  // 视频相关
  chooseVideo: function(e){
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success:(res)=>{
        this.clearInput("video")
        this.setData({
          video:res
        });
        wx.showToast({
          title: '上传成功！',
        })
      }
    })
  },

  deleteVideo: function(e){
    this.setData({
      video:{}
    })
  },

  // 获取地理位置

  getCityName(address) {
    let city = undefined
    if (address) {
      let index0 = address.indexOf('省')
      let index1 = address.indexOf('市')
      if (index0 > 0 && index1 > 0 && index1 > index0 ) {
        city = address.substring(index0+1, index1+1)
      } else if (address.includes('北京市')) {
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
  },

  chooseLocation:function(e){
    wx.showLoading({
      title: '正在加载',
    })
    wx.chooseLocation({
      success:(res)=>{
        wx.hideLoading({
          success: (res) => {},
        })
        let address = ''; 
        let locName = res.name;
        let city = this.getCityName(res.address)
        if(city){
          address = city + '·' + locName
        }else{
          address = locName
        }
        this.setData({
          location: address
        })
      },
      fail:(res)=>{
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },

  deleteLocation:function(e){
    this.setData({
      location: ''
    })
  },

  // 是否匿名
  postStatus:function(e){
    this.setData({
      anonymous: !this.data.anonymous
    },()=>{
      console.log(this.data.anonymous)
    })
  },


  // 发布的类型
  clickTag:function(e){
    console.log(e) 
    let topicId = e.target.dataset.topicid;
    let topic = this.data.topic;
    topic.selected = topicId;
    this.setData({
      topic
    })
  }



})
