// pages/mine/mine.js
const app = getApp();

Page({
  data: {
    userInfo: null,
    activeTab: 'published', // published | joined
    activities: [],
    loading: true
  },

  onLoad: function () {
    this.checkLogin();
  },

  onShow: function () {
    if (this.data.userInfo) {
      this.getMyActivities();
    }
  },

  // 检查登录状态
  checkLogin: function () {
    const userInfo = app.globalData.userInfo;
    if (userInfo) {
      this.setData({ userInfo });
      this.getMyActivities();
    }
  },

  // 登录
  login: function () {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      console.log('登录成功', res);
      // 获取用户信息
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          const userInfo = res.userInfo;
          app.globalData.userInfo = userInfo;
          this.setData({ userInfo });
          this.getMyActivities();
        }
      });
    }).catch(err => {
      console.error('登录失败', err);
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      });
    });
  },

  // 切换 Tab
  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ 
      activeTab: tab,
      loading: true 
    });
    this.getMyActivities();
  },

  // 获取我的活动
  getMyActivities: function () {
    this.setData({ loading: true });

    wx.cloud.callFunction({
      name: 'getMyActivities',
      data: {
        type: this.data.activeTab
      }
    }).then(res => {
      console.log('获取我的活动成功', res);
      this.setData({
        activities: res.result.data,
        loading: false
      });
    }).catch(err => {
      console.error('获取我的活动失败', err);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    });
  },

  // 进入详情页
  goDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    });
  }
});
