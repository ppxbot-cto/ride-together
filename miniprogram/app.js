// app.js
// 云环境 ID：须与微信开发者工具里「cloudfunctions 右键 → 当前环境」一致，否则登录会失败
// 若为空字符串则使用默认环境（第一个创建的环境）
const CLOUD_ENV_ID = '';

App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      const options = { traceUser: true };
      if (CLOUD_ENV_ID) options.env = CLOUD_ENV_ID;
      wx.cloud.init(options);
    }

    this.globalData = {
      userInfo: null,
      openid: null
    };

    try {
      const saved = wx.getStorageSync('userInfo');
      if (saved && (saved.nickName || saved.avatarUrl)) {
        this.globalData.userInfo = saved;
      }
    } catch (e) {}
  },

  globalData: {
    userInfo: null,
    openid: null
  }
});
