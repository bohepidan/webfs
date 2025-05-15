import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchNodeStatus } from "../services/api";
import ResourceChart from "../components/ResourceChart";

const NodeMonitor = () => {
    const [nodes, setNodes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login"); // 如果没有令牌，跳转到登录页面
            }

            const fetchData = async () => {
                try {
                    const data = await fetchNodeStatus(token);
                    setNodes(data);
                } catch (err) {
                    navigate("/login"); // 如果令牌无效，跳转到登录页面
                }
            };

            fetchData();
        }, 5000); // 每 5 秒刷新一次

        return () => clearInterval(interval); // 清理定时器

    }, [navigate]);

    return (
        <div>
            <h1>Node Monitor</h1>
            {nodes.map((node) => (
                <div key={node.id} style={{ marginBottom: "20px" }}>
                    <h2>{node.name} ({node.ip})</h2>
                    <ResourceChart title="CPU Usage (%)" dataKey="cpu" data={node.history} />
                    <ResourceChart title="Memory Usage (%)" dataKey="memory" data={node.history} />
                    <ResourceChart title="GPU Usage (%)" dataKey="gpu" data={node.history} />
                    <ResourceChart title="Disk Usage (%)" dataKey="disk" data={node.history} />
                </div>
            ))}
        </div>
    );
};

export default NodeMonitor;