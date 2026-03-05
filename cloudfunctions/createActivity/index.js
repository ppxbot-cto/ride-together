// cloudfunctions/createActivity/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const db = cloud.database();
  
  const { title, type, meetTime, meetLocation, route, description, maxParticipants } = event;

  // 参数验证
  if (!title || !type || !meetTime || !meetLocation) {
    return {
      success: false,
      message: '缺少必填参数'
    };
  }

  if (!['motorcycle', 'bicycle'].includes(type)) {
    return {
      success: false,
      message: '车型类型无效'
    };
  }

  try {
    // 获取用户信息
    const users = db.collection('users');
    const userResult = await users.where({ _openid: openid }).get();
    
    let userInfo = {
      openid,
      nickname: '骑友',
      avatarUrl: ''
    };
    
    if (userResult.data.length > 0) {
      const user = userResult.data[0];
      userInfo = {
        openid,
        nickname: user.nickname || '骑友',
        avatarUrl: user.avatarUrl || ''
      };
    }

    // 创建活动
    const activities = db.collection('activities');
    const result = await activities.add({
      data: {
        title,
        type,
        meetTime,
        meetLocation,
        route: route || '',
        description: description || '',
        maxParticipants: maxParticipants || 20,
        organizer: userInfo,
        participants: [],
        status: 'active',
        createdAt: db.serverDate()
      }
    });

    return {
      success: true,
      activityId: result._id,
      message: '创建成功'
    };
  } catch (err) {
    console.error('创建活动失败', err);
    return {
      success: false,
      message: err.message
    };
  }
};
