// pages/detail/detail.js
const app = getApp();

Page({
  data: {
    activityId: '',
    activity: null,
    loading: true,
    isOrganizer: false,
    hasJoined: false,
    joining: false,
    cancelling: false
  },

  onLoad: function (options) {
    const id = options.id;
    this.setData({ activityId: id });
    this.getActivityDetail(id);
  },

  // 获取活动详情
  getActivityDetail: function (id) {
    this.setData({ loading: true });

    const db = wx.cloud.database();
    
    db.collection('activities').doc(id).get().then(res => {
      const activity = res.data;
      
      // 检查是否是组织者或已加入
      this.checkUserStatus(activity);
      
      this.setData({
        activity: activity,
        loading: false
      });
    }).catch(err => {
      console.error('获取活动详情失败', err);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      this.setData({ loading: false });
    });
  },

  // 检查用户状态
  checkUserStatus: function (activity) {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      const openid = res.result.openid;
      
      const isOrganizer = activity.organizer.openid === openid;
      const hasJoined = activity.participants.some(p => p.openid === openid);
      
      this.setData({
        isOrganizer: isOrganizer,
        hasJoined: hasJoined
      });
    });
  },

  // 加入活动
  joinActivity: function () {
    if (this.data.activity.participants.length >= this.data.activity.maxParticipants) {
      wx.showToast({ title: '已满员', icon: 'none' });
      return;
    }

    this.setData({ joining: true });

    wx.cloud.callFunction({
      name: 'joinActivity',
      data: {
        activityId: this.data.activityId
      }
    }).then(res => {
      console.log('加入成功', res);
      wx.showToast({
        title: '加入成功',
        icon: 'success'
      });
      
      // 刷新页面
      this.getActivityDetail(this.data.activityId);
      this.setData({ joining: false });
    }).catch(err => {
      console.error('加入失败', err);
      wx.showToast({
        title: err.message || '加入失败',
        icon: 'none'
      });
      this.setData({ joining: false });
    });
  },

  // 取消报名
  cancelJoin: function () {
    wx.showModal({
      title: '确认取消',
      content: '确定要取消报名吗？',
      success: (res) => {
        if (res.confirm) {
          this.doCancelJoin();
        }
      }
    });
  },

  doCancelJoin: function () {
    this.setData({ cancelling: true });

    wx.cloud.callFunction({
      name: 'cancelJoin',
      data: {
        activityId: this.data.activityId
      }
    }).then(res => {
      console.log('取消成功', res);
      wx.showToast({
        title: '已取消报名',
        icon: 'success'
      });
      
      // 刷新页面
      this.getActivityDetail(this.data.activityId);
      this.setData({ cancelling: false });
    }).catch(err => {
      console.error('取消失败', err);
      wx.showToast({
        title: err.message || '取消失败',
        icon: 'none'
      });
      this.setData({ cancelling: false });
    });
  }
});
