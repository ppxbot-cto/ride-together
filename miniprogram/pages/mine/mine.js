// pages/mine/mine.js
const app = getApp();

Page({
  data: {
    userInfo: null,
    activeTab: 'published',
    activities: [],
    loading: true,
    showLoginSheet: false,
    loginForm: { avatarPath: '' }
  },

  onLoad: function () {
    const cached = app.globalData.userInfo;
    this.setData({ userInfo: cached || null });
    if (cached) this.getMyActivities();
  },

  onShow: function () {
    const cached = app.globalData.userInfo;
    this.setData({ userInfo: cached || null });
    if (cached) this.getMyActivities();
  },

  // 点击登录：先尝试 getUserProfile 弹窗获取微信头像昵称
  tapLogin: function () {
    wx.getUserProfile({
      desc: '用于在活动中展示你的头像与昵称',
      success: (res) => {
        const { avatarUrl, nickName } = res.userInfo || {};
        if (nickName || avatarUrl) {
          this.doLoginWithProfile(avatarUrl || '', nickName || '骑友');
          return;
        }
        this.setData({ showLoginSheet: true });
      },
      fail: () => {
        this.setData({ showLoginSheet: true });
      }
    });
  },

  doLoginWithProfile: function (avatarUrl, nickName) {
    wx.showLoading({ title: '登录中…' });
    const raw = (nickName || '').trim();
    // 视为「未获取到微信昵称」：空、「微信用户」、或手动登录时的「骑友」
    const hasWechatNick = raw && raw !== '微信用户' && raw !== '骑友';

    wx.cloud.callFunction({ name: 'login' }).then(res => {
      const openid = (res.result && res.result.openid) || '';
      app.globalData.openid = openid;
      // 获取不到微信昵称时用 openid 后六位作为昵称
      const name = hasWechatNick
        ? raw.slice(0, 32)
        : (openid && openid.length >= 6 ? openid.slice(-6) : '骑友');

      const saveProfile = (avatarFileID) => {
        return wx.cloud.callFunction({
          name: 'updateUserProfile',
          data: avatarFileID ? { nickname: name, avatarUrl: avatarFileID } : { nickname: name }
        }).then(r => ({ user: (r.result && r.result.user) || { nickname: name, avatarUrl: '' }, name }));
      };

      if (!avatarUrl || typeof avatarUrl !== 'string' || avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
        return saveProfile('');
      }
      const cloudPath = 'avatar/' + (openid || 'u') + '_' + Date.now() + '.jpg';
      return wx.cloud.uploadFile({ cloudPath, filePath: avatarUrl })
        .then(up => saveProfile(up.fileID))
        .catch((uploadErr) => {
          console.warn('头像上传失败，仅保存昵称', uploadErr);
          return saveProfile('');
        });
    }).then(result => {
      wx.hideLoading();
      const user = result.user || {};
      const name = result.name || user.nickname || '骑友';
      let displayName = user.nickname || name;
      if (displayName === '微信用户') displayName = name;
      const userInfo = {
        nickName: displayName,
        avatarUrl: user.avatarUrl || ''
      };
      app.globalData.userInfo = userInfo;
      try { wx.setStorageSync('userInfo', userInfo); } catch (e) {}
      this.setData({ userInfo });
      wx.showToast({ title: '登录成功', icon: 'success' });
      this.getMyActivities();
    }).catch(err => {
      wx.hideLoading();
      console.error('登录失败', err);
      wx.showToast({ title: '登录失败，请重试', icon: 'none' });
    });
  },

  closeLoginSheet: function () {
    this.setData({ showLoginSheet: false, loginForm: { avatarPath: '' } });
  },

  onLoginSheetChooseAvatar: function (e) {
    const path = (e.detail && e.detail.avatarUrl) || '';
    this.setData({ 'loginForm.avatarPath': path });
  },

  confirmLoginSheet: function () {
    const { avatarPath } = this.data.loginForm;
    this.doLoginWithProfile(avatarPath || '', '骑友');
    this.closeLoginSheet();
  },

  logout: function () {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出吗？',
      success: (res) => {
        if (res.confirm) {
          app.globalData.userInfo = null;
          app.globalData.openid = null;
          try { wx.removeStorageSync('userInfo'); } catch (e) {}
          this.setData({ userInfo: null, activities: [] });
          wx.showToast({ title: '已退出', icon: 'none' });
        }
      }
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

  // 获取我的活动（仅已登录时调用）
  getMyActivities: function () {
    if (!app.globalData.userInfo) return;
    this.setData({ loading: true });
    wx.cloud.callFunction({
      name: 'getMyActivities',
      data: { type: this.data.activeTab }
    }).then(res => {
      this.setData({ activities: res.result.data || [], loading: false });
    }).catch(() => {
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
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
