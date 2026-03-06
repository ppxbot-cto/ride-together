# 骑行记 RT - RideTogether 🏍️🚴

> 骑行活动社交平台小程序 - 找到趣味相投的车友，一起出发！

## 📖 项目简介

**骑行记 RT** 是一个面向摩托车和自行车爱好者的微信小程序，帮助车友发布和参与骑行活动，让一个人骑行变成一群人狂欢。

### 产品背景

| 项目 | 说明 |
|------|------|
| **小程序名称** | 骑行记 RT |
| **AppID** | wxebc7acc8fde8d204 |
| **类目** | 工具 > 信息查询 |
| **痛点** | 以前只能在微信群里找车友一起骑车，信息分散、难以检索 |
| **解决方案** | 集中化的骑行活动发布和报名平台 |
| **目标用户** | 摩托车爱好者、自行车爱好者、骑行俱乐部 |
| **开发时间** | 2026 年 3 月 |
| **技术栈** | 微信小程序 + 微信云开发 |

---

## 🎯 Beta 版本功能

### 核心功能

| 功能 | 说明 | 状态 |
|------|------|------|
| 微信登录 | 一键登录，获取昵称头像 | ✅ |
| 发布骑行活动 | 时间、集合地点、路线描述、车型要求 | ✅ |
| 浏览活动列表 | 按车型筛选（全部/摩托车/自行车） | ✅ |
| 加入活动 | 点击报名，活动发起人能看到参与者 | ✅ |
| 取消报名 | 临时有事可以退出 | ✅ |
| 我的活动 | 查看我发布的 / 我加入的活动 | ✅ |
| 活动详情 | 查看参与者列表、活动信息 | ✅ |

### 车型支持

- 🏍️ **摩托车** - 机车、踏板、越野等
- 🚴 **自行车** - 公路车、山地车、折叠车等

### Beta 版本限制

- ❌ 不做内容审核（用户发布内容直接显示）
- ❌ 所有功能免费（无付费功能）
- ❌ 无地图路线展示（纯文字描述）
- ❌ 无消息通知（需手动查看）

---

## 🏗️ 技术架构

### 技术选型

```
前端：微信小程序原生（WXML/WXSS/JavaScript）
后端：微信云开发（云函数）
数据库：微信云数据库
部署：微信云托管
```

### 为什么选择云开发？

| 优势 | 说明 |
|------|------|
| 快速上线 | 无需搭建服务器，专注业务逻辑 |
| 成本最低 | 免费额度够 MVP 使用 |
| 免运维 | 微信自动管理基础设施 |
| 生态友好 | 与小程序深度集成 |

---

## 📁 完整项目结构

```
ride-together/
│
├── miniprogram/                          # 小程序前端目录
│   ├── pages/                            # 页面目录
│   │   ├── index/                        # 首页 - 活动列表
│   │   │   ├── index.wxml                # 页面结构
│   │   │   ├── index.wxss                # 页面样式
│   │   │   ├── index.js                  # 页面逻辑
│   │   │   └── index.json                # 页面配置
│   │   │
│   │   ├── publish/                      # 发布页 - 创建活动
│   │   │   ├── publish.wxml
│   │   │   ├── publish.wxss
│   │   │   ├── publish.js
│   │   │   └── publish.json
│   │   │
│   │   ├── detail/                       # 详情页 - 活动详情 + 加入/取消
│   │   │   ├── detail.wxml
│   │   │   ├── detail.wxss
│   │   │   ├── detail.js
│   │   │   └── detail.json
│   │   │
│   │   └── mine/                         # 我的页面 - 我的活动
│   │       ├── mine.wxml
│   │       ├── mine.wxss
│   │       ├── mine.js
│   │       └── mine.json
│   │
│   ├── images/                           # 图片资源
│   │   ├── README.md                     # 图标说明
│   │   ├── home.png                      # 首页图标（需补充）
│   │   ├── home-active.png
│   │   ├── publish.png
│   │   ├── publish-active.png
│   │   ├── mine.png
│   │   └── mine-active.png
│   │
│   ├── app.js                            # 小程序入口文件（初始化云开发）
│   ├── app.json                          # 小程序全局配置（页面路由、TabBar）
│   ├── app.wxss                          # 全局样式文件
│   └── sitemap.json                      # 索引配置
│
├── cloudfunctions/                       # 云函数目录（后端逻辑）
│   │
│   ├── login/                            # 用户登录
│   │   ├── index.js                      # 登录逻辑 + 用户信息存储
│   │   └── package.json                  # 依赖配置
│   │
│   ├── createActivity/                   # 创建活动
│   │   ├── index.js                      # 创建活动逻辑
│   │   └── package.json
│   │
│   ├── getActivities/                    # 获取活动列表
│   │   ├── index.js                      # 查询活动列表（支持筛选）
│   │   └── package.json
│   │
│   ├── joinActivity/                     # 加入活动
│   │   ├── index.js                      # 加入活动逻辑
│   │   └── package.json
│   │
│   ├── cancelJoin/                       # 取消报名
│   │   ├── index.js                      # 取消报名逻辑
│   │   └── package.json
│   │
│   └── getMyActivities/                  # 获取我的活动
│       ├── index.js                      # 查询我发布/我加入的活动
│       └── package.json
│
├── project.config.json                   # 项目配置文件（AppID 等）
├── project.private.config.json           # 私有配置（本地开发用，不提交）
└── README.md                             # 项目说明文档
```

---

## 📄 核心文件说明

### 前端文件

| 文件 | 作用 | 说明 |
|------|------|------|
| `app.js` | 小程序入口 | 初始化云开发环境 |
| `app.json` | 全局配置 | 页面路由、TabBar、窗口样式 |
| `app.wxss` | 全局样式 | 通用样式类（卡片、按钮、标签等） |
| `pages/index/*` | 首页 | 活动列表展示 + 车型筛选 |
| `pages/publish/*` | 发布页 | 活动发布表单 |
| `pages/detail/*` | 详情页 | 活动详情 + 加入/取消操作 |
| `pages/mine/*` | 我的页面 | 我发布的/我加入的活动 |

### 云函数文件

| 云函数 | 输入参数 | 返回值 | 说明 |
|--------|---------|--------|------|
| `login` | 无 | `{openid, success}` | 获取用户 openid，创建/更新用户记录 |
| `createActivity` | `{title, type, meetTime, meetLocation, route, description, maxParticipants}` | `{success, activityId}` | 创建新活动 |
| `getActivities` | `{type}` | `{success, data: []}` | 获取活动列表（支持按类型筛选） |
| `joinActivity` | `{activityId}` | `{success, message}` | 加入活动（检查重复/满员） |
| `cancelJoin` | `{activityId}` | `{success, message}` | 取消报名 |
| `getMyActivities` | `{type}` | `{success, data: []}` | 获取我的活动（published/joined） |

---

## 🗄️ 数据库设计

### activities 集合

```json
{
  "_id": "自动生成",
  "_openid": "创建者 openid",
  "title": "活动标题（字符串，最多 50 字）",
  "type": "motorcycle | bicycle",
  "meetTime": "2026-03-10 09:00（字符串）",
  "meetLocation": "集合地点（字符串，最多 100 字）",
  "route": "路线描述（字符串，最多 200 字）",
  "description": "详细说明（字符串，最多 500 字）",
  "maxParticipants": 20（数字）,
  "organizer": {
    "openid": "组织者 openid",
    "nickname": "昵称",
    "avatarUrl": "头像 URL"
  },
  "participants": [
    {
      "openid": "参与者 openid",
      "nickname": "昵称",
      "avatarUrl": "头像 URL",
      "joinTime": "加入时间"
    }
  ],
  "status": "active | completed | cancelled",
  "createdAt": "创建时间（服务器时间）"
}
```

### users 集合

```json
{
  "_id": "自动生成",
  "_openid": "用户 openid",
  "nickname": "昵称",
  "avatarUrl": "头像 URL",
  "gender": 0 | 1 | 2,
  "createdAt": "创建时间",
  "lastLoginAt": "最后登录时间"
}
```

---

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

# 2. 用微信开发者工具打开项目目录

# 3. 配置 AppID
# 编辑 project.config.json，将 appid 替换为你的小程序 AppID

# 4. 开通云开发
# 在开发者工具中点击「云开发」按钮，开通服务
# 创建环境（免费版即可）

# 5. 上传云函数
# 右键 cloudfunctions 目录 → 选择「上传并部署：云端安装依赖」
# 等待所有云函数上传完成

# 6. 创建数据库集合
# 在云开发控制台 → 数据库
# 创建两个集合：activities、users
# 设置权限：所有用户可读写（或自定义安全规则）

# 7. 添加 TabBar 图标
# 准备 6 个图标文件放入 miniprogram/images/ 目录
# 或临时去掉 app.json 中的 iconPath 配置

# 8. 编译运行
# 点击编译按钮，在模拟器中预览
# 真机预览需要扫码
```

---

## 📱 页面功能详解

### 首页（index）

**功能：**
- 显示所有活动列表（按创建时间倒序）
- 车型筛选：全部 / 摩托车 / 自行车
- 下拉刷新
- 点击卡片进入详情页

**界面元素：**
- 筛选栏（顶部）
- 活动卡片（标题、时间、地点、组织者、参与人数）
- 空状态提示（无活动时）

### 发布页（publish）

**功能：**
- 选择车型（摩托车/自行车）
- 填写活动标题
- 选择集合时间（日期 + 时间选择器）
- 填写集合地点
- 填写路线描述（可选）
- 填写详细说明（可选）
- 设置最大人数（可选，默认 20）

**表单验证：**
- 标题、时间、地点为必填
- 输入长度限制

### 详情页（detail）

**功能：**
- 显示活动完整信息
- 显示组织者信息
- 显示参与者列表
- 加入/取消报名按钮
- 状态判断：组织者不可加入，已加入可取消

### 我的页面（mine）

**功能：**
- 显示用户头像和昵称
- Tab 切换：我发布的 / 我加入的
- 点击活动进入详情页

---

## 🔐 安全说明

### Beta 版本安全措施

| 措施 | 说明 |
|------|------|
| 用户登录验证 | 通过微信 openid 识别用户 |
| 数据库权限 | 仅创建者可修改自己的数据 |
| 输入长度限制 | 防止恶意长文本攻击 |
| 重复加入检查 | 防止重复报名 |
| 满员检查 | 超过人数上限不可加入 |

### 待完善（V2+）

- [ ] 内容审核机制
- [ ] 用户举报功能
- [ ] 敏感词过滤
- [ ] 实名认证（可选）
- [ ] 活动评价系统

---

## 📋 开发计划

### V1.0 Beta（当前）✅

- [x] 项目初始化
- [x] 用户登录
- [x] 发布活动
- [x] 浏览活动
- [x] 加入活动
- [x] 取消报名
- [x] 我的活动

### V1.1（下一步）

- [ ] 活动评论功能
- [ ] 分享活动到微信群
- [ ] 活动状态管理（已结束/已取消）
- [ ] 组织者手动结束活动

### V2.0

- [ ] 地图路线展示（集成腾讯地图）
- [ ] 骑行轨迹记录
- [ ] 活动签到功能
- [ ] 消息通知（服务通知）
- [ ] 用户主页/信誉系统

### V3.0

- [ ] 俱乐部功能
- [ ] 活动相册（照片分享）
- [ ] 骑行数据统计
- [ ] 付费活动支持
- [ ] 活动评价系统

---

## 🛠️ 常见问题

### 1. 云函数上传失败

**原因：** 未安装依赖或网络问题

**解决：**
```bash
# 在每个云函数目录下执行
cd cloudfunctions/login
npm install

# 然后在开发者工具中右键 → 上传并部署
```

### 2. 数据库权限错误

**原因：** 数据库集合权限设置不当

**解决：**
- 云开发控制台 → 数据库
- 选择集合 → 权限设置
- 设置为「所有用户可读写」或自定义规则

### 3. TabBar 图标不显示

**原因：** 图标文件缺失或路径错误

**解决：**
- 准备 6 个 81x81 的 PNG 图标
- 放入 `miniprogram/images/` 目录
- 或临时去掉 `app.json` 中的 `iconPath` 配置

### 4. 获取用户信息失败

**原因：** 微信要求用户主动授权

**解决：**
- 使用 `wx.getUserProfile` API
- 需要用户点击按钮触发
- 在「我的」页面添加登录按钮

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 代码规范

- 遵循微信小程序开发规范
- 云函数使用 async/await
- 注释清晰，变量命名规范

---

## 📄 许可证

Copyright © 2026 PPX 无限责任公司

---

## 📞 联系方式

- **GitHub:** https://github.com/ppxbot-cto
- **项目地址:** https://github.com/ppxbot-cto/ride-together
- **Issues:** https://github.com/ppxbot-cto/ride-together/issues

---

<div align="center">

_骑行记，不孤单！_ 🏍️🚴

**Created with ❤️ by PPX 无限责任公司**

</div>
