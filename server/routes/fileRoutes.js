const express = require("express");
const axios = require("axios"); // 用于与节点通信
const router = express.Router();

// 模拟分布式节点信息
const NODES = [
    { ip: "127.0.0.1", port: 4321 },
];

// 随机选择一个节点
const getRandomNode = () => NODES[Math.floor(Math.random() * NODES.length)];

// 文件上传接口
router.post("/upload", async (req, res) => {
    try {
        const node = getRandomNode();
        const response = await axios.post(`http://${node.ip}:${node.port}/files/upload`, req.body, {
            headers: { "Content-Type": "application/octet-stream" },
            params: { filename: req.query.filename },
        });
        res.status(response.status).send(response.data);
    } catch (error) {
        res.status(500).send("Error uploading file: " + error.message);
    }
});

// 文件删除接口
router.delete("/:filename", async (req, res) => {
    try {
        const { filename } = req.params;
        for (const node of NODES) {
            await axios.delete(`http://${node.ip}:${node.port}/files/${filename}`);
        }
        res.status(200).send("File deleted from all nodes.");
    } catch (error) {
        res.status(500).send("Error deleting file: " + error.message);
    }
});

// 获取文件列表接口
router.get("/", async (req, res) => {
    try {
        console.log('获取文件列表...');
        const fileLists = await Promise.all(
            NODES.map((node) =>
                axios.get(`http://${node.ip}:${node.port}/files`).then((response) => response.data)
            )
        );
        console.log(fileLists);
        // const fileLists = ["file1.txt", "file2.png", "file3.pdf"]; // 示例文件列表
        console.log('获取成功')
        const uniqueFiles = [...new Set(fileLists.flat())]; // 去重
        res.status(200).json(uniqueFiles);
    } catch (error) {
        res.status(500).send("Error fetching files: " + error.message);
    }
});

module.exports = router;