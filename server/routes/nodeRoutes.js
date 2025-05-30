const express = require("express");
const router = express.Router();
const {
    addNode,
    deleteNode,
    getNodeStatus,
    updateNodeStatus
} = require("../controllers/nodeController");

// 添加节点
router.post("/add", addNode);

// 删除节点
router.delete("/delete/:id", deleteNode);

// web端获取节点状态
router.get("/status", getNodeStatus);

// 资源采集模块更新节点状态
router.put("/status/:id", updateNodeStatus);

module.exports = router;