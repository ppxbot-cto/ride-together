// cloudfunctions/login/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  
  const openid = wxContext.OPENID;
  const appid = wxContext.APPID;
  const unionid = wxContext.UNIONID;

  // 获取用户信息并保存到数据库
  const db = cloud.database();
  const users = db.collection('users');
  
  try {
    // 查询用户是否已存在
    const userResult = await users.where({
      _openid: openid
    }).get();

    let user = { nickname: '骑友', avatarUrl: '' };

    if (userResult.data.length === 0) {
      // 新用户，创建记录
      const addResult = await users.add({
        data: {
          _openid: openid,
          nickname: '骑友',
          avatarUrl: '',
          gender: 0,
          createdAt: db.serverDate(),
          lastLoginAt: db.serverDate()
        }
      });
      user = { nickname: '骑友', avatarUrl: '', _id: addResult._id };
    } else {
      // 老用户，更新最后登录时间并返回用户信息
      const doc = userResult.data[0];
      await users.doc(doc._id).update({
        data: {
          lastLoginAt: db.serverDate()
        }
      });
      user = {
        nickname: doc.nickname || '骑友',
        avatarUrl: doc.avatarUrl || '',
        _id: doc._id
      };
    }

    return {
      openid,
      appid,
      unionid,
      success: true,
      user
    };
  } catch (err) {
    console.error('登录失败', err);
    return {
      openid,
      success: false,
      error: err.message
    };
  }
};
