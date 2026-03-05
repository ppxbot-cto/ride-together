# 一起骑 - RideTogether 🏍️🚴

> 骑行活动社交平台小程序 - 找到趣味相投的车友，一起出发！

## 📖 项目简介

**一起骑** 是一个面向摩托车和自行车爱好者的微信小程序，帮助车友发布和参与骑行活动，让一个人骑行变成一群人狂欢。

### 产品背景

- **痛点**：以前只能在微信群里找车友一起骑车，信息分散、难以检索
- **解决方案**：集中化的骑行活动发布和报名平台
- **目标用户**：摩托车爱好者、自行车爱好者、骑行俱乐部

## 🎯 Beta 版本功能

### 核心功能

| 功能 | 说明 |
|------|------|
| 微信登录 | 一键登录，获取昵称头像 |
| 发布骑行活动 | 时间、集合地点、路线描述、车型要求 |
| 浏览活动列表 | 按时间/地区/车型筛选 |
| 加入活动 | 点击报名，活动发起人能看到参与者 |
| 我的活动 | 查看我发布的 / 我加入的活动 |
| 活动详情 | 查看参与者列表、活动信息 |

### 车型支持

- 🏍️ **摩托车** - 机车、踏板、越野等
- 🚴 **自行车** - 公路车、山地车、折叠车等

### Beta 版本限制

- ❌ 不做内容审核（用户发布内容直接显示）
- ❌ 所有功能免费（无付费功能）
- ❌ 无地图路线展示（纯文字描述）
- ❌ 无消息通知（需手动查看）

## 🏗️ 技术架构

### 技术栈

```
前端：微信小程序原生（WXML/WXSS/JavaScript）
后端：微信云开发（云函数）
数据库：微信云数据库
部署：微信云托管
```

### 为什么选择云开发？

1. **快速上线** - 无需搭建服务器，专注业务逻辑
2. **成本最低** - 免费额度够 MVP 使用
3. **免运维** - 微信自动管理基础设施
4. **生态友好** - 与小程序深度集成

### 项目结构

```
ride-together/
├── miniprogram/              # 小程序前端
│   ├── pages/
│   │   ├── index/            # 首页（活动列表）
│   │   ├── publish/          # 发布活动
│   │   ├── detail/           # 活动详情
│   │   └── mine/             # 我的活动
│   ├── components/           # 公共组件
│   ├── utils/                # 工具函数
│   ├── app.js                # 小程序入口
│   ├── app.json              # 小程序配置
│   ├── app.wxss              # 全局样式
│   └── sitemap.json          # 索引配置
├── cloudfunctions/           # 云函数
│   ├── login/                # 用户登录
│   ├── createActivity/       # 创建活动
│   ├── getActivities/        # 获取活动列表
│   ├── joinActivity/         # 加入活动
│   ├── cancelJoin/           # 取消报名
│   └── getMyActivities/      # 获取我的活动
├── project.config.json       # 项目配置
├── project.private.config.json
└── README.md
```

## 🚀 快速开始

### 前置条件

1. 注册微信小程序账号：https://mp.weixin.qq.com/
2. 下载微信开发者工具：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
3. 获取 AppID

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/ppxbot-cto/ride-together.git
cd ride-together

# 2. 用微信开发者工具打开项目

# 3. 配置 AppID
# 在 project.config.json 中填入你的 AppID

# 4. 开通云开发
# 在开发者工具中点击「云开发」，开通服务

# 5. 上传云函数
# 右键 cloudfunctions 目录，选择「上传并部署」

# 6. 创建数据库
# 在云开发控制台创建集合：activities, users
```

### 数据库结构

#### activities 集合

```json
{
  "_id": "自动生成",
  "_openid": "用户 openid",
  "title": "活动标题",
  "type": "motorcycle|bicycle",
  "meetTime": "2026-03-10 09:00",
  "meetLocation": "集合地点",
  "route": "路线描述",
  "description": "详细说明",
  "organizer": {
    "openid": "组织者 openid",
    "nickname": "昵称",
    "avatarUrl": "头像"
  },
  "participants": [
    {
      "openid": "参与者 openid",
      "nickname": "昵称",
      "avatarUrl": "头像",
      "joinTime": "加入时间"
    }
  ],
  "maxParticipants": 20,
  "createdAt": "创建时间",
  "status": "active|completed|cancelled"
}
```

#### users 集合

```json
{
  "_id": "自动生成",
  "_openid": "用户 openid",
  "nickname": "昵称",
  "avatarUrl": "头像",
  "gender": 0|1|2,
  "createdAt": "创建时间",
  "lastLoginAt": "最后登录时间"
}
```

## 📱 页面说明

### 首页（index）

- 活动列表（按时间倒序）
- 车型筛选（全部/摩托车/自行车）
- 下拉刷新
- 点击卡片进入详情页

### 发布页（publish）

- 活动标题
- 车型选择（摩托车/自行车）
- 集合时间（日期时间选择器）
- 集合地点（文字输入）
- 路线描述（文字输入）
- 详细说明（多行文本）
- 最大人数（可选）

### 详情页（detail）

- 活动完整信息
- 组织者信息
- 参与者列表
- 加入/取消按钮
- 联系组织者（可复制微信）

### 我的（mine）

- 我发布的活动
- 我加入的活动
- 切换 Tab 查看

## 🔐 安全说明

### Beta 版本安全措施

- 用户登录验证（微信 openid）
- 数据库权限控制（仅创建者可修改）
- 输入长度限制（防止恶意数据）

### 待完善（V2）

- 内容审核机制
- 用户举报功能
- 敏感词过滤
- 实名认证（可选）

## 📋 开发计划

### V1.0 Beta（当前）

- [x] 项目初始化
- [x] 用户登录
- [x] 发布活动
- [x] 浏览活动
- [x] 加入活动
- [x] 我的活动

### V1.1

- [ ] 活动评论功能
- [ ] 分享活动到微信群
- [ ] 活动状态管理（已结束/已取消）

### V2.0

- [ ] 地图路线展示
- [ ] 骑行轨迹记录
- [ ] 活动签到
- [ ] 消息通知
- [ ] 用户主页/信誉系统

### V3.0

- [ ] 俱乐部功能
- [ ] 活动相册
- [ ] 骑行数据统计
- [ ] 付费活动支持

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

Copyright © 2026 PPX 无限责任公司

## 📞 联系方式

- GitHub: https://github.com/ppxbot-cto
- 项目 Issues: https://github.com/ppxbot-cto/ride-together/issues

---

_一起骑，不孤单！_ 🏍️🚴
