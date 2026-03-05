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
      maxParticipants: ''
    },
    timeRange: [],
    timeIndex: [0, 0],
    submitting: false
  },

  onLoad: function () {
    this.initTimePicker();
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

    // 调用云函数创建活动
    wx.cloud.callFunction({
      name: 'createActivity',
      data: {
        ...form,
        maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants) : 20
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
  }
});
