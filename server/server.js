const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Node = require("./models/Node");

const app = express();
const PORT = 8000;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 数据库连接
mongoose
    .connect("mongodb://localhost:27017/remoteFileManager", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Database connected"))
    .catch((err) => console.error("Database connection error:", err));

const { router: authRoutes, authMiddleware } = require("./routes/authRoutes");
const nodeRoutes = require("./routes/nodeRoutes");

// 添加用户认证路由
app.use("/api/auth", authRoutes);

// 保护资源监控路由
// app.use("/api/nodes", authMiddleware, nodeRoutes);
//TODO:暂时让所有节点操作都跳过身份验证，但当添加节点操作的权限限制时需要更改，但总之put操作，也就是节点上传数据是跳过验证的。
app.use("/api/nodes", nodeRoutes);

// 启动服务
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});