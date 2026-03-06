// cloudfunctions/updateUserProfile/index.js
// 支持「用户不存在时先创建再更新」，避免未走 login 时设置昵称/头像失败
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

function normalizeNickname(v) {
  if (v == null) return '';
  const s = String(v).trim();
  return s.length > 0 ? s.slice(0, 64) : '';
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { nickname, avatarUrl } = event;

  const db = cloud.database();
  const users = db.collection('users');

  const nick = normalizeNickname(nickname);
  const avatar = typeof avatarUrl === 'string' ? avatarUrl : '';

  try {
    const userResult = await users.where({ _openid: openid }).get();
    let doc = userResult.data[0];

    if (!doc) {
      const toSaveNick = nick || '骑友';
      const addResult = await users.add({
        data: {
          _openid: openid,
          nickname: toSaveNick,
          avatarUrl: avatar,
          gender: 0,
          createdAt: db.serverDate(),
          lastLoginAt: db.serverDate()
        }
      });
      return {
        success: true,
        user: { nickname: toSaveNick, avatarUrl: avatar }
      };
    }

    const updateData = {};
    if (nick) updateData.nickname = nick;
    if (event.avatarUrl !== undefined && typeof event.avatarUrl === 'string') updateData.avatarUrl = event.avatarUrl;

    if (Object.keys(updateData).length === 0) {
      return { success: true, user: { nickname: doc.nickname, avatarUrl: doc.avatarUrl || '' } };
    }

    await users.doc(doc._id).update({
      data: updateData
    });

    return {
      success: true,
      user: {
        nickname: updateData.nickname !== undefined ? updateData.nickname : doc.nickname,
        avatarUrl: updateData.avatarUrl !== undefined ? updateData.avatarUrl : (doc.avatarUrl || '')
      }
    };
  } catch (err) {
    console.error('updateUserProfile error', err);
    return { success: false, error: err.message };
  }
};
