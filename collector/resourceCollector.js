const axios = require("axios");
const si = require("systeminformation");
const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();

// 替换为你的后端服务器地址
const BACKEND_URL = "http://localhost:8000/api/nodes";

const PORT = 4321; // 每个节点的资源收集模块监听独立端口

// 节点本地存储路径
const STORAGE_DIR = path.join(__dirname, "storage");
if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR);
}

// 模拟分布式文件系统的节点信息
// const NODES = [
//     { ip: "127.0.0.1", port: 4321 },
// ];

// 本地持久化存储 NODE_ID 的文件名
const NODE_ID_FILE = "node_id.json";

let NODE_ID = null;


// 文件上传
app.post("/files/upload", express.raw({ type: "application/octet-stream" }), async (req, res) => {
    const { filename } = req.query;
    if (!filename) return res.status(400).send("Filename is required");

    const filePath = path.join(STORAGE_DIR, filename);
    fs.writeFileSync(filePath, req.body);
    console.log(`File ${filename} saved locally.`);

    // TODO: 分片并分发到其他节点
    res.status(200).send("File uploaded successfully.");
});

// 文件删除
app.delete("/files/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(STORAGE_DIR, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send("File not found.");
    }

    fs.unlinkSync(filePath);
    console.log(`File ${filename} deleted locally.`);

    // TODO: 通知其他节点删除文件
    res.status(200).send("File deleted successfully.");
});

// 获取文件列表
app.get("/files", (req, res) => {
    console.log('获取文件列表...')
    const files = fs.readdirSync(STORAGE_DIR);
    console.log(files);
    console.log('获取成功...')
    res.status(200).json(files);
});

// 启动模拟文件系统
app.listen(PORT, () => {
    console.log(`Node resource collector running on port ${PORT}`);
});

// 从本地文件加载 NODE_ID
const loadNodeId = () => {
    if (fs.existsSync(NODE_ID_FILE)) {
        const data = fs.readFileSync(NODE_ID_FILE, "utf-8");
        const { nodeId } = JSON.parse(data);
        return nodeId;
    }
    return null;
};

// 将 NODE_ID 保存到本地文件
const saveNodeId = (nodeId) => {
    fs.writeFileSync(NODE_ID_FILE, JSON.stringify({ nodeId }));
};

// 删除本地保存的 NODE_ID 文件
const deleteNodeIdFile = () => {
    if (fs.existsSync(NODE_ID_FILE)) {
        fs.unlinkSync(NODE_ID_FILE);
    }
};

// 申请节点
const registerNode = async () => {
    try {
        const response = await axios.post(`${BACKEND_URL}/add`, {
            name: `Node-${Date.now()}`, // 节点名可以动态生成
            ip: "127.0.0.1", // 根据实际情况设置 IP
        });
        NODE_ID = response.data.node._id; // 保存申请到的 NODE_ID
        saveNodeId(NODE_ID); // 持久化保存
        console.log("Node registered successfully:", NODE_ID);
    } catch (error) {
        console.error("Error registering node:", error.message);
        process.exit(1); // 注册失败时退出程序
    }
};

// 删除节点
const unregisterNode = async () => {
    if (!NODE_ID) return;
    try {
        await axios.delete(`${BACKEND_URL}/delete/${NODE_ID}`);
        console.log("Node unregistered successfully:", NODE_ID);
        deleteNodeIdFile(); // 删除本地保存的 NODE_ID
    } catch (error) {
        console.error("Error unregistering node:", error.message);
    }
};

// 收集资源状态并上传到后端
const collectAndSendData = async () => {
    if (!NODE_ID) {
        console.error("No NODE_ID found, skipping data update.");
        return;
    }
    try {
        // 收集资源状态信息
        const [cpu, mem, disk, gpu] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.fsSize(),
            si.graphics(),
        ]);
        // 计算状态数据
        // console.log("Raw collected data:", { cpu, mem, disk, gpu });
        const status = {
            cpu: cpu.currentLoad.toFixed(2), // 当前 CPU 使用率
            memory: ((mem.used / mem.total) * 100).toFixed(2), // 内存使用率
            disk: disk[0].use.toFixed(2), // 磁盘使用率
            gpu: (gpu.controllers[0] && gpu.controllers[0].memoryUsed && gpu.controllers[0].memoryTotal)
                ? (gpu.controllers[0].memoryUsed / gpu.controllers[0].memoryTotal).toFixed(2) : 0, // GPU 使用率
        };
        // TODO:本电脑的GPU结构如下所示，有的controller不存在memorytotal和memoryused，可能需要更改GPU的利用率计算公式
        // GPU: {
        //     "controllers": [
        //       {
        //         "vendor": "NVIDIA",
        //         "model": "NVIDIA GeForce RTX 3060 Laptop GPU",
        //         "bus": "PCI",
        //         "vram": 6144,
        //         "vramDynamic": false,
        //         "subDeviceId": "0x3A8017AA",
        //         "driverVersion": "546.33",
        //         "name": "NVIDIA GeForce RTX 3060 Laptop GPU",
        //         "pciBus": "00000000:01:00.0",
        //         "memoryTotal": 6144,
        //         "memoryUsed": 1555,
        //         "memoryFree": 4454,
        //         "utilizationMemory": 2,
        //         "temperatureGpu": 50,
        //         "powerDraw": 27.54,
        //         "clockCore": 1425,
        //         "clockMemory": 7000
        //       },
        //       {
        //         "vendor": "Shanghai Best Oray Information Technology Co., Ltd.",
        //         "model": "OrayIddDriver Device",
        //         "bus": "",
        //         "vram": 0,
        //         "vramDynamic": true,
        //         "subDeviceId": null
        //       }
        //     ],
        //     "displays": [
        //       {
        //         "vendor": "(Standard monitor types)",
        //         "model": "Generic PnP Monitor",
        //         "deviceName": "\\\\.\\DISPLAY1",
        //         "main": true,
        //         "builtin": false,
        //         "connection": "HDMI",
        //         "resolutionX": 2560,
        //         "resolutionY": 1440,
        //         "sizeX": 60,
        //         "sizeY": 33,
        //         "pixelDepth": "32",
        //         "currentResX": 2560,
        //         "currentResY": 1440,
        //         "positionX": 0,
        //         "positionY": 0,
        //         "currentRefreshRate": 144
        //       },
        //       {
        //         "vendor": "",
        //         "model": "",
        //         "deviceName": "\\\\.\\DISPLAY2",
        //         "main": false,
        //         "builtin": false,
        //         "connection": "DP embedded",
        //         "resolutionX": 1707,
        //         "resolutionY": 1067,
        //         "sizeX": 34,
        //         "sizeY": 22,
        //         "pixelDepth": "32",
        //         "currentResX": 1707,
        //         "currentResY": 1067,
        //         "positionX": 2560,
        //         "positionY": 0,
        //         "currentRefreshRate": 144
        //       }
        //     ]
        //   }


        // 向后端服务器上传数据
        await axios.put(`${BACKEND_URL}/status/${NODE_ID}`, { status });
        console.log("Resource status updated successfully:", status);
    } catch (error) {
        console.error("Error updating resource status:", error.message);
    }
};

// 捕获退出信号，自动删除节点
process.on("SIGINT", async () => {
    console.log("Caught interrupt signal, unregistering node...");
    await unregisterNode();
    process.exit();
});

process.on("SIGTERM", async () => {
    console.log("Caught termination signal, unregistering node...");
    await unregisterNode();
    process.exit();
});

// 主函数
(async () => {
    NODE_ID = loadNodeId(); // 尝试加载已有的 NODE_ID
    if (!NODE_ID) {
        await registerNode(); // 如果没有 NODE_ID，则申请新节点
    }

    // 每隔 10 秒收集并上传一次数据
    setInterval(collectAndSendData, 10000);
})();
