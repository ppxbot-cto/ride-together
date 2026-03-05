// pages/mine/mine.js
const app = getApp();

Page({
  data: {
    userInfo: null,
    activeTab: 'published', // published | joined
    activities: [],
    loading: true,
    loginLoading: true  // 自动登录中
  },

  onLoad: function () {
    this.autoLogin();
  },

  onShow: function () {
    if (this.data.userInfo) {
      this.getMyActivities();
    }
  },

  // 自动登录（微信云开发静默登录，无需用户点击）
  autoLogin: function () {
    const cached = app.globalData.userInfo;
    if (cached) {
      this.setData({ userInfo: cached, loginLoading: false });
      this.getMyActivities();
      return;
    }

    this.setData({ loginLoading: true });
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      const result = res.result || {};
      if (!result.success) {
        this.setData({ loginLoading: false });
        wx.showToast({ title: '登录失败', icon: 'none' });
        return;
      }
      const user = result.user || {};
      const userInfo = {
        nickName: user.nickname || '骑友',
        avatarUrl: user.avatarUrl || ''
      };
      app.globalData.userInfo = userInfo;
      app.globalData.openid = result.openid;
      this.setData({ userInfo, loginLoading: false });
      this.getMyActivities();
    }).catch(err => {
      console.error('登录失败', err);
      this.setData({ loginLoading: false });
      wx.showToast({
        title: '登录失败，请重试',
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
