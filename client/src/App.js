import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import NodeMonitor from "./pages/NodeMonitor";
import NavigationPage from "./pages/Navigation";
import FileManager from "./pages/FileManager";

const App = () => {
    const isAuthenticated = () => {
        return !!localStorage.getItem("token"); // 检查 token 是否存在
    };
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/nav"
                    element={isAuthenticated() ? <NavigationPage /> : <Navigate to="/" />}
                />
                <Route
                    path="/file-manager"
                    element={isAuthenticated() ? <FileManager /> : <Navigate to="/" />}
                />
                <Route
                    path="/node-monitor"
                    element={isAuthenticated() ? <NodeMonitor /> : <Navigate to="/" />}
                />
            </Routes>
        </Router>
    );
};

export default App;