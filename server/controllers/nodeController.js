const Node = require("../models/Node");

// 添加节点
exports.addNode = async (req, res) => {
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
        const nodes = await Node.find();
        res.status(200).json(nodes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 更新节点状态
exports.updateNodeStatus = async (req, res) => {
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
};