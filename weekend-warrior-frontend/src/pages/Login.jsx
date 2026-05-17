import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (response.ok) {
        // СОХРАНЯЕМ токен и ID в localStorage браузера
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user_id);
        
        alert("Вход выполнен! 🔓");
        navigate("/"); // Переходим на главную
      } else {
        alert(data.error || "Ошибка входа");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ background: "#121214", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "sans-serif" }}>
      <form onSubmit={handleLogin} style={{ background: "rgba(255,255,255,0.03)", padding: 40, borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 15, width: 320 }}>
        <h2>Вход в Weekend Warrior</h2>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: 12, borderRadius: 10, border: "none", background: "rgba(255,255,255,0.1)", color: "white" }} />
        <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: 12, borderRadius: 10, border: "none", background: "rgba(255,255,255,0.1)", color: "white" }} />
        <button type="submit" style={{ padding: 12, borderRadius: 10, border: "none", background: "linear-gradient(135deg,#667eea,#9333c0)", color: "white", fontWeight: "bold", cursor: "pointer" }}>Войти</button>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>Нет аккаунта? <Link to="/register" style={{ color: "#4ade80" }}>Регистрация</Link></p>
      </form>
    </div>
  );
}

export default Login;