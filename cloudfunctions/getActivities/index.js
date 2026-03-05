// cloudfunctions/getActivities/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  const db = cloud.database();
  const { type } = event;
  
  try {
    const activities = db.collection('activities');
    
    // 构建查询条件
    let query = activities.where({
      status: 'active'
    });

    // 按类型筛选
    if (type && type !== 'all') {
      query = query.where({
        type: type
      });
    }

    // 获取数据，按创建时间倒序
    const result = await query
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();

    return {
      success: true,
      data: result.data
    };
  } catch (err) {
    console.error('获取活动列表失败', err);
    return {
      success: false,
      message: err.message,
      data: []
    };
  }
};
