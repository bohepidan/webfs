const Node = require("../models/Node");

// 添加节点
exports.addNode = async (req, res) => {
    try {
        const { name, ip } = req.body;
        const newNode = new Node({ name, ip, status: {} });
        await newNode.save();
        res.status(201).json({ message: "Node added successfully", node: newNode });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 删除节点
exports.deleteNode = async (req, res) => {
    try {
        const { id } = req.params;
        await Node.findByIdAndDelete(id);
        res.status(200).json({ message: "Node deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 获取节点状态
exports.getNodeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const node = await Node.findById(id);
        if (!node) {
            return res.status(404).json({ error: "Node not found" });
        }
        res.status(200).json(node);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 更新节点状态
exports.updateNodeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const node = await Node.findByIdAndUpdate(
            id,
            { status, lastUpdated: Date.now() },
            { new: true }
        );
        res.status(200).json({ message: "Node updated successfully", node });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};