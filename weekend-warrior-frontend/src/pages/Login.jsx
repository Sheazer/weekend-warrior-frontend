import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (response.ok) {
        // Записываем данные сессии в браузер
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user_id);
        
        navigate("/"); // На главную страницу
      } else {
        alert(data.error || "Неверный email или пароль");
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка сети. Бэкенд запущен?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#121214", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "sans-serif" }}>
      <form onSubmit={handleLogin} style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)", padding: 40, borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 15, width: 320, boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
        <h2 style={{ margin: "0 0 10px 0", textAlign: "center" }}>Вход в систему</h2>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: 12, borderRadius: 10, border: "none", background: "rgba(255,255,255,0.1)", color: "white", outline: "none" }} />
        <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: 12, borderRadius: 10, border: "none", background: "rgba(255,255,255,0.1)", color: "white", outline: "none" }} />
        <button type="submit" disabled={loading} style={{ padding: 12, borderRadius: 10, border: "none", background: "linear-gradient(135deg,#667eea,#9333c0)", color: "white", fontWeight: "bold", cursor: "pointer", marginTop: 10 }}>
          {loading ? "Проверка..." : "Войти"}
        </button>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center", margin: "10px 0 0 0" }}>Впервые тут? <Link to="/register" style={{ color: "#4ade80" , textDecoration: "none"}}>Регистрация</Link></p>
      </form>
    </div>
  );
}

export default Login;