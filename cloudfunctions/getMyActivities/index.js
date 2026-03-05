// cloudfunctions/getMyActivities/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const db = cloud.database();
  
  const { type } = event; // 'published' | 'joined'

  try {
    const activities = db.collection('activities');
    let result;

    if (type === 'published') {
      // 获取我发布的活动
      result = await activities
        .where({
          'organizer.openid': openid
        })
        .orderBy('createdAt', 'desc')
        .limit(100)
        .get();
    } else if (type === 'joined') {
      // 获取我加入的活动
      result = await activities
        .where({
          'participants.openid': openid
        })
        .orderBy('createdAt', 'desc')
        .limit(100)
        .get();
    } else {
      result = { data: [] };
    }

    return {
      success: true,
      data: result.data
    };
  } catch (err) {
    console.error('获取我的活动失败', err);
    return {
      success: false,
      message: err.message,
      data: []
    };
  }
};
