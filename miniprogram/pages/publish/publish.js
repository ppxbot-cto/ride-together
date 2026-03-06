// pages/publish/publish.js
const app = getApp();

Page({
  data: {
    form: {
      type: 'motorcycle',
      title: '',
      meetTime: '',
      meetLocation: '',
      route: '',
      description: '',
      maxParticipants: '',
      qrCodeTempPath: ''  // 选的二维码临时路径，提交时上传云存储
    },
    timeRange: [],
    timeIndex: [0, 0],
    submitting: false
  },

  onLoad: function () {
    if (!app.globalData.userInfo) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      wx.switchTab({ url: '/pages/mine/mine' });
      return;
    }
    this.initTimePicker();
  },

  onShow: function () {
    if (!app.globalData.userInfo) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      wx.switchTab({ url: '/pages/mine/mine' });
      return;
    }
  },

  // 初始化时间选择器
  initTimePicker: function () {
    const dates = [];
    const times = [];
    
    // 生成未来7天的日期
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
      dates.push(`${month}月${day}日 周${weekDay}`);
    }

    // 生成时间段（6:00 - 22:00，每30分钟）
    for (let h = 6; h <= 22; h++) {
      times.push(`${h}:00`);
      if (h !== 22) {
        times.push(`${h}:30`);
      }
    }

    this.setData({
      timeRange: [dates, times]
    });
  },

  // 选择车型
  selectType: function (e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      'form.type': type
    });
  },

  // 输入处理
  onInput: function (e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    this.setData({
      [`form.${field}`]: value
    });
  },

  // 选择群/微信二维码
  chooseQrCode: function () {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera']
    }).then(res => {
      const path = res.tempFiles[0].tempFilePath;
      this.setData({ 'form.qrCodeTempPath': path });
    }).catch(err => {
      if (err.errMsg && !err.errMsg.includes('cancel')) {
        wx.showToast({ title: '选择图片失败', icon: 'none' });
      }
    });
  },

  removeQrCode: function () {
    this.setData({ 'form.qrCodeTempPath': '' });
  },

  // 时间选择
  onTimeChange: function (e) {
    const values = e.detail.value;
    const dateStr = this.data.timeRange[0][values[0]];
    const timeStr = this.data.timeRange[1][values[1]];
    
    // 解析日期
    const match = dateStr.match(/(\d+)月(\d+)日/);
    const month = match[1].padStart(2, '0');
    const day = match[2].padStart(2, '0');
    const year = new Date().getFullYear();
    
    const meetTime = `${year}-${month}-${day} ${timeStr}`;
    
    this.setData({
      'form.meetTime': meetTime,
      timeIndex: values
    });
  },

  // 提交表单
  submitForm: function () {
    if (!getApp().globalData.userInfo) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      wx.switchTab({ url: '/pages/mine/mine' });
      return;
    }

    const { form } = this.data;

    // 验证必填项
    if (!form.title.trim()) {
      wx.showToast({ title: '请输入活动标题', icon: 'none' });
      return;
    }
    if (!form.meetTime) {
      wx.showToast({ title: '请选择集合时间', icon: 'none' });
      return;
    }
    if (!form.meetLocation.trim()) {
      wx.showToast({ title: '请输入集合地点', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    const doCreate = (qrCodeFileID) => {
      wx.cloud.callFunction({
        name: 'createActivity',
        data: {
          type: form.type,
          title: form.title.trim(),
          meetTime: form.meetTime,
          meetLocation: form.meetLocation.trim(),
          route: (form.route || '').trim(),
          description: (form.description || '').trim(),
          maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants) : 20,
          qrCodeFileID: qrCodeFileID || ''
        }
      }).then(res => {
      console.log('创建成功', res);
      wx.showToast({
        title: '发布成功',
        icon: 'success'
      });
      
      // 清空表单并返回首页
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }, 1500);
    }).catch(err => {
      console.error('创建失败', err);
      wx.showToast({
        title: '发布失败，请重试',
        icon: 'none'
      });
      this.setData({ submitting: false });
    });
    };

    if (form.qrCodeTempPath) {
      const cloudPath = 'qrcode/' + Date.now() + '_' + Math.random().toString(36).slice(2) + '.jpg';
      wx.cloud.uploadFile({
        cloudPath,
        filePath: form.qrCodeTempPath
      }).then(res => doCreate(res.fileID)).catch(err => {
        console.error('二维码上传失败', err);
        wx.showToast({ title: '二维码上传失败，是否继续发布？', icon: 'none', duration: 2000 });
        setTimeout(() => doCreate(''), 500);
      });
    } else {
      doCreate('');
    }
  }
});
