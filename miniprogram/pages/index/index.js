// pages/index/index.js
const app = getApp();

Page({
  data: {
    activities: [],
    loading: true,
    filterType: 'all' // all, motorcycle, bicycle
  },

  onLoad: function () {
    this.getActivities();
  },

  onShow: function () {
    this.getActivities();
  },

  onPullDownRefresh: function () {
    this.getActivities().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 获取活动列表
  getActivities: function () {
    this.setData({ loading: true });

    return wx.cloud.callFunction({
      name: 'getActivities',
      data: {
        type: this.data.filterType
      }
    }).then(res => {
      console.log('获取活动列表成功', res);
      this.setData({
        activities: res.result.data,
        loading: false
      });
    }).catch(err => {
      console.error('获取活动列表失败', err);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    });
  },

  // 切换筛选
  changeFilter: function (e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ filterType: type });
    this.getActivities();
  },

  // 进入详情页
  goDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    });
  }
});
