// cloudfunctions/cancelJoin/index.js
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

    // 检查是否已加入
    const participantIndex = activity.data.participants.findIndex(p => p.openid === openid);
    if (participantIndex === -1) {
      return {
        success: false,
        message: '你未加入该活动'
      };
    }

    // 从数组中移除该参与者
    await activities.doc(activityId).update({
      data: {
        participants: db.command.pull({
          openid: openid
        })
      }
    });

    return {
      success: true,
      message: '取消成功'
    };
  } catch (err) {
    console.error('取消报名失败', err);
    return {
      success: false,
      message: err.message
    };
  }
};
