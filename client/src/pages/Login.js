import React, { useState } from "react";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        console.log('handleSubmit...');
        e.preventDefault();
        try {
            const response = await axios.post("/auth/login", {
                username,
                password,
            });
            // 保存 JWT 到 LocalStorage
            localStorage.setItem("token", response.data.token);
            navigate("/nav"); // 跳转到导航界面
        } catch (err) {
            setError("Invalid username or password");
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Login;