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

// API 路由
app.post("/api/nodes/add", async (req, res) => {
    try {
        const { name, ip } = req.body;
        const newNode = new Node({ name, ip, status: {}, history: [] });
        console.log('test1:', name, ip);
        await newNode.save();
        console.log('test2:', newNode._id);
        res.status(201).json({ message: "Node added successfully", node: newNode });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete("/api/nodes/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Node.findByIdAndDelete(id);
        res.status(200).json({ message: "Node deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/nodes/status", async (req, res) => {
    try {
        const nodes = await Node.find();
        res.status(200).json(nodes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/api/nodes/status/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        console.log('In /api/nodes/status/:id,', 'ID:', id, 'STATUS:', status);
        const node = await Node.findById(id);
        if (!node) return res.status(404).json({ error: "Node not found" });

        // 更新状态和历史数据
        node.status = status;
        node.history.push({ ...status, time: new Date() });
        node.lastUpdated = new Date();
        await node.save();

        res.status(200).json({ message: "Node updated successfully", node });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 启动服务
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});