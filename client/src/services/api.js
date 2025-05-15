import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api"; // 替换为你的后端地址

export const fetchNodeStatus = async (token) => {
    console.log('fetchNodeStatus...');
    try {
        const response = await axios.get(`${API_BASE_URL}/nodes/status`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch node status:", error);
        return [];
    }
};

const api = axios.create({
    baseURL: API_BASE_URL, // 统一配置后端地址
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // 自动附加 Token
    },
});

export default api;