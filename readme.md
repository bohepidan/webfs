# webfs

轻量级文件系统的的基础管理

AI记录:<https://github.com/copilot/share/0a5f5130-43e0-8057-a003-a447a0dd4090>

## 运行

web前端：cd client & npm start
web后端：cd server & node ./server.js
资源收集模块：cd collector & node ./resourceCollector.js

## 功能

### 系统监控

- 机群节点的添加、删除等；
- 机群节点的状态监控
- 每个集群节点上的CPU、内存、GPU、磁盘空间利用率的监控

### 用户管理

- 用户登录界面，支持用户依靠账户密码登录
- TODO:暂时用户只有管理员一种

### 日志管理

- TODO:记录什么人对哪个节点的哪个文件进行了CDRW中的哪个操作

### 角色管理

- TODO:为用户分配CDRW权限

## 架构

javascript react node.js mongodb

**后端代码架构**
webfs/
├── server/               # 后端
│   ├── models/           # 数据库模型
│   ├── routes/           # 路由文件
│   ├── controllers/      # 业务逻辑
│   ├── utils/            # 工具类
│   ├── server.js         # 主服务入口
├── client/               # 前端代码

**前端代码架构**
client/
├── public/                     # 静态资源目录
│   ├── index.html              # 应用入口 HTML
│   ├── favicon.ico             # 网站图标
│   └── manifest.json           # PWA 配置（可选）
├── src/                        # 源代码目录
│   ├── components/             # 可复用的 React 组件
│   │   ├── ResourceChart.js    # 单个节点的资源监控折线图组件
│   │   └── NavBar.js           # 导航栏组件（可选）
│   ├── pages/                  # 页面组件
│   │   ├── NodeMonitor.js      # 节点监控页面
│   │   └── NotFound.js         # 404 页面（可选）
│   ├── services/               # API 调用服务
│   │   └── api.js              # 后端 API 调用逻辑
│   ├── styles/                 # 样式文件
│   │   └── global.css          # 全局样式
│   ├── App.js                  # 应用入口组件
│   ├── index.js                # 应用渲染入口
│   ├── reportWebVitals.js      # 性能监控（可选）
│   └── setupTests.js           # 测试环境配置（可选）
├── package.json                # 项目依赖配置
├── .gitignore                  # Git 忽略文件

**资源采集模块**
collector
├── resourceCollecotr.js        #资源采集源文件
├── node_id.json                #本地持久化存储 NODE_ID

