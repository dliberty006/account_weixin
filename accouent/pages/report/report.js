var Charts = require('wxcharts.js');
var util = require('../../utils/util.js');
var ringChart = null;
var ringChart2 = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    year:'',
    month:'',
    accountMoney:'',
    comeinMoney:'',
    reportList:[],
    comeinList:[],
    showActivityMeng:false,
    noAddCom:0,
    endMonth:"",
    endYear:""
  },

  touchHandler: function (e) {
    var index = ringChart.getCurrentDataIndex(e);
    var list = this.data.reportList;
    if (index == -1 && list.length == 1) {
      return;
    }
    var cateType = '0';
    this.loadReportList(list, cateType,index);
  },
  touchHandler2: function (e) {
    var index = ringChart2.getCurrentDataIndex(e);
    var list = this.data.comeinList;
    if (index == -1 && list.length == 1) {
      return;
    }
    
    var cateType = '1';
    this.loadReportList(list, cateType, index);
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
    var isBack = getApp().globalData.isBackInfo;
    this.data.noAddCom = 0;
    this.setData({
      noAddCom: 0
    })
    if (!isBack){
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;      
      this.setData({
        year: year,
        month: month,
        endMonth: month,
        endYear:year
        
      })
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      this.loadAccount();
      this.loadComein();
      this.isOrNotShowModal();
    }
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
  
  },
  //加载消费的图
  loadAccount:function(){
    var that = this;
    wx.request({
      url: 'https://www.72toy.com/liberty/account/findReport.htm',
      dataType: 'json',
      data: {
        session: wx.getStorageSync('3rd_session'),
        cateType: '0',
        year: that.data.year,
        month:that.data.month
      },
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET",
      success: function (result) {
        that.setData({
          accountMoney:result.data.money/100,
          reportList: result.data.reportList
        })
       
        var windowWidth = 375;
        try {
          var res = wx.getSystemInfoSync();
          windowWidth = res.windowWidth;
        } catch (e) {
          console.error('getSystemInfoSync failed!');
        }
        var accountLength = result.data.reportList.length;       
        if (accountLength!=0){
          ringChart = new Charts({
            animation: true,
            canvasId: 'ringCanvas',
            type: 'ring',
            extra: {
              ringWidth: 25,
              pie: {
                offsetAngle: -45
              }
            },
            series: result.data.reportList,
            width: windowWidth,
            height: 300,
            disablePieStroke: true,
            dataLabel: true,
            legend: true,
            background: '#f5f5f5',
            padding: 50
          });
        }else{
          var noAddCom = that.data.noAddCom;
          that.setData({
            noAddCom: noAddCom+1
          })
        }
        setTimeout(() => {
          if (ringChart != null) {
            ringChart.stopAnimation();
          }
        }, 500);
       
      },
      complete:function(){
        wx.hideLoading();
      }
    })
  },
  //加载收入的图
  loadComein: function () {
    var that = this;
    wx.request({
      url: 'https://www.72toy.com/liberty/account/findReport.htm',
      dataType: 'json',
      data: {
        session: wx.getStorageSync('3rd_session'),
        cateType: '1',
        year: that.data.year,
        month: that.data.month
      },
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET",
      success: function (result) {
        that.setData({
          comeinMoney: result.data.money / 100,
          comeinList: result.data.reportList
        })
        
        var windowWidth = 375;
        try {
          var res = wx.getSystemInfoSync();
          windowWidth = res.windowWidth;
        } catch (e) {
          console.error('getSystemInfoSync failed!');
        }    
        var comeinLength = result.data.reportList.length;
        if (comeinLength!=0){
          ringChart2 = new Charts({
            animation: true,
            canvasId: 'ringCanvas2',
            type: 'ring',
            extra: {
              ringWidth: 25,
              pie: {
                offsetAngle: -45
              }
            },
            series: result.data.reportList,
            width: windowWidth,
            height: 300,
            disablePieStroke: true,
            dataLabel: true,
            legend: true,
            background: '#f5f5f5',
            padding: 50
          }); 
        }else{
          var noAddCom = that.data.noAddCom;
          that.setData({
            noAddCom: noAddCom + 1
          })
        }
        setTimeout(() => {
          if (ringChart2 != null) {
           ringChart2.stopAnimation();
          }
        }, 500);
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  loadReportList : function(list,cateType,index) {
    var cateName = list[index].name;
    var year = this.data.year;
    var month = this.data.month;
    wx.navigateTo({
      url: '/pages/reportList/reportList?cateName=' + cateName + '&cateType='+cateType + '&year=' + year + '&month=' + month
    })
  },
  /**
   * 废弃的方法
   */
  activity_click : function(e){
      this.setData({
        showActivityMeng: true
      })    
  },
  /**
   * 选择查看历史的方法
   */
  activity_report_history : function(e){
    var that=this;

    var date = e.detail.value;
    var year = date.substring(0, 4);
    var month = date.substring(5, 7);

  
    this.setData({
      year: year,
      month: month, 
      showActivityMeng: false,
      noAddCom:0
     
    })    
    console.log("选择了："+year+"年"+month+"月");
    
   //修改消费的图
    wx.request({
      url: 'https://www.72toy.com/liberty/account/findReport.htm',
      dataType: 'json',
      data: {
        session: wx.getStorageSync('3rd_session'),       
        cateType: '0',
        year: year,
        month: month
      },      
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET",
      success: function (result) {
        that.setData({
          accountMoney: result.data.money / 100,
          reportList: result.data.reportList
        })       
        var comeinLength = result.data.reportList.length;
        if (comeinLength != 0) {
          var windowWidth = 375;
          try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
          } catch (e) {
            console.error('getSystemInfoSync failed!');
          }
          if (ringChart==null){
            ringChart = new Charts({
              animation: true,
              canvasId: 'ringCanvas',
              type: 'ring',
              extra: {
                ringWidth: 25,
                pie: {
                  offsetAngle: -45
                }
              },
              series: result.data.reportList,
              width: windowWidth,
              height: 300,
              disablePieStroke: true,
              dataLabel: true,
              legend: true,
              background: '#f5f5f5',
              padding: 50
            });
          }else{
            ringChart.updateData({
              series: result.data.reportList          
              });
          }
        }else{
          var noAddCom = that.data.noAddCom;
          that.setData({
            noAddCom: noAddCom + 1
          })     
        }
        setTimeout(() => {
          if (ringChart != null) {
            ringChart.stopAnimation();
          }
        }, 500);
      },
      complete: function () {
        wx.hideLoading();
      }
    });
    //修改收入的图
    wx.request({
      url: 'https://www.72toy.com/liberty/account/findReport.htm',
      dataType: 'json',
      data: {
        session: wx.getStorageSync('3rd_session'),
        cateType: '1',
        year: that.data.year,
        month: that.data.month
      },
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET",
      success: function (result) {
        that.setData({
          comeinMoney: result.data.money / 100,
          comeinList: result.data.reportList
        })

        var windowWidth = 375;
        try {
          var res = wx.getSystemInfoSync();
          windowWidth = res.windowWidth;
        } catch (e) {
          console.error('getSystemInfoSync failed!');
        }
        var comeinLength = result.data.reportList.length;
        if (comeinLength != 0) {
          if(ringChart2==null){
            ringChart2 = new Charts({
              animation: true,
              canvasId: 'ringCanvas2',
              type: 'ring',
              extra: {
                ringWidth: 25,
                pie: {
                  offsetAngle: -45
                }
              },
              series: result.data.reportList,
              width: windowWidth,
              height: 300,
              disablePieStroke: true,
              dataLabel: true,
              legend: true,
              background: '#f5f5f5',
              padding: 50
            }); 
          }else{
            ringChart2.updateData({
              series: result.data.reportList
            });
          }
        } else {
          var noAddCom = that.data.noAddCom;
          that.setData({
            noAddCom: noAddCom + 1
          })
        }
        setTimeout(() => {
          if (ringChart2 != null) {
            ringChart2.stopAnimation();
          }
         
        }, 500);
      },
      complete: function () {
        wx.hideLoading();
      }
    }); 
    this.isOrNotShowModal();
  },
  /**
   * 是否提示为记账
   */
  isOrNotShowModal: function(){
    setTimeout(() => {
      if(this.data.noAddCom==2){
        wx.showModal({
          content: '小主还没有记账，先添加一笔吧？',
          showCancel:'记一笔',
          cancelText:'再看看',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/ji/ji'
              })
            } else {
              console.log('用户点击取消')
            }
          }
        })
      }
    }, 1000);
  }
 
})