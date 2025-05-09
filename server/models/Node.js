const mongoose = require("mongoose");

// 节点模型
const nodeSchema = new mongoose.Schema({
    name: String,
    ip: String,
    status: {
        cpu: Number, // CPU 使用率
        memory: Number, // 内存使用率
        gpu: Number, // GPU 使用率
        disk: Number, // 磁盘空间使用率
    },
    history: [
        {
            time: Date,
            cpu: Number,
            memory: Number,
            gpu: Number,
            disk: Number,
        },
    ],
    lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Node", nodeSchema);

