import React from "react";
import { useNavigate } from "react-router-dom";

const NavigationPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token"); // 清除 token
        navigate("/"); // 返回登录页面
    };

    return (
        <div>
            <h1>Navigation</h1>
            <button onClick={() => navigate("/node-monitor")}>Node Monitor</button>
            <button onClick={() => navigate("/file-manager")}>File Manager</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default NavigationPage;