// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    accountMoney:0,
    incomeMoney:0,
    descVoList:[],
    delIndex:0,
    recordId:'',
    showMeng:false,
    parentindex:-1,
    liindex:-1,
    month:"",
    endMonth:"",
    year:"",
    endYear:"",
    height:'100%',
    top:'0%',
    budgetMoney:'--',
    availableMoney:'--'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
   
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
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    this.setData({
      year: year,
      month: month,
      endMonth:month,
      endYear:year
    });
    var that = this;
    getApp().globalData.isBackInfo = false;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    that.loadData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '记账小本本',
      path: '/page/user?id=123'
    }
  },
  jiyibi:function(){
    wx.navigateTo({
      url: '/pages/ji/ji'
    })
  },
  loadData:function(){
    console.log("加载数据");
    var that = this;
    console.log(wx.getStorageSync('3rd_session'));
    wx.request({
      url: getApp().globalData.host + '/liberty/account/accountIndex.htm',
      dataType: 'json',
      data: {
        session: wx.getStorageSync('3rd_session'),
        year:that.data.year,
        month: that.data.month
      },
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET",
      success: function (result) {
        console.log("数据加载完成");
        console.log(result.data.descVoList);
        that.setData({
          accountMoney: result.data.accountMoney/100,
          incomeMoney:result.data.incomeMoney/100,
          descVoList: result.data.descVoList,
          budgetMoney: result.data.budgetMoney
        });
        wx.hideLoading();
      }
    })
  },
  modifyAccount:function(e){
    var recordid = e.currentTarget.dataset.recordid;
    this.setData({
      recordId: "",
      showMeng: false
    })
    wx.navigateTo({
      url: '/pages/ji/ji?recordId=' + recordid
    })
  },
  delMeng:function(e) {
    var recordid = e.currentTarget.dataset.recordid;
    var parentindex = e.currentTarget.dataset.parentindex;
    var liindex = e.currentTarget.dataset.liindex;
    this.setData({
      recordId: recordid,
      showMeng:true,
      parentindex: parentindex,
      liindex: liindex
    })
  },
  cancelMeng:function(e){
    this.setData({
      recordId: "",
      showMeng: false
    })
  },
  delRecord:function(e){
    var that = this;
    that.setData({
      recordId: "",
      showMeng: false
    });
    var parentindex = e.currentTarget.dataset.parentindex;
    var liindex = e.currentTarget.dataset.liindex;
    var recordid = e.currentTarget.dataset.recordid;
    wx.request({
      url: getApp().globalData.host + '/liberty/account/deleteAccount.htm',
      dataType: 'json',
      data: {
        session: wx.getStorageSync('3rd_session'),
        recordId: recordid
      },
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET",
      success: function (result) {
        if (result.data.code == '0') {
          that.loadData();
        } else {
          wx.showModal({
            title: '提示',
            content: result.data.message,
            showCancel: false,
            success: function (res) {
            }
          })
        }
       
      }
    })
  },
  /**
   * 选择时间
   */
  changeDate: function(e){
    console.log(e.detail.value);
    var date = e.detail.value;
    var year = date.substring(0, 4);
    var month = date.substring(5, 7);
    this.setData({
      year:year,
      month:month
    });
    this.loadData();
  }

})