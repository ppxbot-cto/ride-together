// cloudfunctions/joinActivity/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const db = cloud.database();
  
  const { activityId } = event;

  if (!activityId) {
    return {
      success: false,
      message: '缺少活动 ID'
    };
  }

  try {
    const activities = db.collection('activities');
    const activity = await activities.doc(activityId).get();

    if (!activity.data) {
      return {
        success: false,
        message: '活动不存在'
      };
    }

    // 检查是否已满
    if (activity.data.participants.length >= activity.data.maxParticipants) {
      return {
        success: false,
        message: '活动已满员'
      };
    }

    // 检查是否已加入
    const alreadyJoined = activity.data.participants.some(p => p.openid === openid);
    if (alreadyJoined) {
      return {
        success: false,
        message: '你已加入该活动'
      };
    }

    // 获取用户信息
    const users = db.collection('users');
    const userResult = await users.where({ _openid: openid }).get();
    
    let userInfo = {
      openid,
      nickname: '骑友',
      avatarUrl: '',
      joinTime: new Date()
    };
    
    if (userResult.data.length > 0) {
      const user = userResult.data[0];
      userInfo = {
        openid,
        nickname: user.nickname || '骑友',
        avatarUrl: user.avatarUrl || '',
        joinTime: new Date()
      };
    }

    // 更新活动，添加参与者
    await activities.doc(activityId).update({
      data: {
        participants: db.command.push(userInfo)
      }
    });

    return {
      success: true,
      message: '加入成功'
    };
  } catch (err) {
    console.error('加入活动失败', err);
    return {
      success: false,
      message: err.message
    };
  }
};
