import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (response.ok) {
        alert("Регистрация успешна! Теперь вооружись паролем и войди. 🚀");
        navigate("/login"); // Перенаправляем на логин
      } else {
        alert(data.error || "Ошибка при регистрации");
      }
    } catch (err) {
      console.error(err);
      alert("Не удалось связаться с бэкендом");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#121214", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "sans-serif" }}>
      <form onSubmit={handleRegister} style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)", padding: 40, borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 15, width: 320, boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
        <h2 style={{ margin: "0 0 10px 0", textAlign: "center" }}>Регистрация</h2>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: 12, borderRadius: 10, border: "none", background: "rgba(255,255,255,0.1)", color: "white", outline: "none" }} />
        <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: 12, borderRadius: 10, border: "none", background: "rgba(255,255,255,0.1)", color: "white", outline: "none" }} />
        <button type="submit" disabled={loading} style={{ padding: 12, borderRadius: 10, border: "none", background: "linear-gradient(135deg, #4ade80, #22c55e)", color: "white", fontWeight: "bold", cursor: "pointer", marginTop: 10 }}>
          {loading ? "Создаем аккаунт..." : "Зарегистрироваться"}
        </button>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center", margin: "10px 0 0 0" }}>Уже есть аккаунт? <Link to="/login" style={{ color: "#667eea", textDecoration: "none" }}>Войти</Link></p>
      </form>
    </div>
  );
}

export default Register;