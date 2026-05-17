import EventCard from "../components/EventCard";
import { useEffect, useState } from "react";
import { getActivities } from "../api/activities";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
  async function load() {
    try {
      const data = await getActivities();
      console.log("DATA:", data); // 👈 ВАЖНО
      setActivities(data);
    } catch (error) {
      console.error(error);
    }
  }

  load();
}, []);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      {/* 🔥 TOP BAR */}
{/* 🔥 TOP BAR с проверкой сессии */}
<div style={{
  display: "flex",
  justifyContent: "space-between", // Растянет элементы по краям
  alignItems: "center",
  marginBottom: 20,
  background: "rgba(255,255,255,0.03)",
  padding: "10px 20px",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.05)"
}}>
  {/* Левая часть: Индикатор сессии */}
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: localStorage.getItem("token") ? "#4ade80" : "#f87171", // Зеленый если в сети, красный если нет
      boxShadow: localStorage.getItem("token") ? "0 0 10px #4ade80" : "0 0 10px #f87171"
    }} />
    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
      {localStorage.getItem("token") 
        ? `В сети (ID: ${localStorage.getItem("userId")})` 
        : "Гость (Авторизуйтесь)"}
    </span>
  </div>

  {/* Правая часть: Кнопки навигации и выхода */}
  <div style={{ display: "flex", gap: 10 }}>
    {localStorage.getItem("token") ? (
      // Если авторизован — показываем Профиль и Выход
      <>
        <button
          onClick={() => navigate("/profile")}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
            padding: "8px 16px",
            borderRadius: 20,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          👤 Профиль
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            window.location.reload(); // Перезагружаем страницу, чтобы сбросить стейт
          }}
          style={{
            background: "rgba(239,68,68,0.2)",
            border: "1px solid rgba(239,68,68,0.4)",
            color: "#f87171",
            padding: "8px 16px",
            borderRadius: 20,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🚪 Выйти
        </button>
      </>
    ) : (
      // Если токена нет — кнопка Войти
      <button
        onClick={() => navigate("/login")}
        style={{
          background: "linear-gradient(135deg, #667eea, #9333c0)",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: 20,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        🔑 Войти
      </button>
    )}

    <button
      onClick={() => navigate("/map")}
      style={{
        background: "#9333c0",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: 20,
        cursor: "pointer",
        fontWeight: "bold",
        boxShadow: "0 2px 8px rgba(147,51,192,0.4)"
      }}
    >
      🗺️ Карта
    </button>
  </div>
</div>
      {/* 🔥 HERO */}
      <div style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        color: "white",
        padding: 20,
        borderRadius: 20,
        marginBottom: 20
      }}>
        {/* <h1>мой первый запуск удался</h1> */}
        <h1>Найди событие рядом 🚀</h1>
        <p>Спорт, IT, встречи и многое другое</p>

        <input
          placeholder="Поиск..."
          style={{
            marginTop: 10,
            padding: 10,
            borderRadius: 10,
            border: "none",
            width: "100%"
          }}
        />
      </div>

      {/* 🔥 ФИЛЬТРЫ */}
      <div style={{
        display: "flex",
        gap: 10,
        marginBottom: 15,
        flexWrap: "wrap"
      }}>
        {["Сегодня", "Завтра", "Выходные", "Бесплатно"].map(f => (
          <button key={f} style={{
            padding: "8px 14px",
            borderRadius: 20,
            border: "none",
            background: "#9900ffd5",
            cursor: "pointer"
          }}>
            {f}
          </button>
        ))}
      </div>

      {/* 🔥 РАДИУС */}
      <div style={{ marginBottom: 20 }}>
        <p>Радиус: 10 км</p>
        <input type="range" min="1" max="10" />
      </div>

      {/* 🔥 СПИСОК */}
      <div>
  {activities.map(a => (
    <EventCard key={a.id} activity={a} />
  ))}
</div>

      {/* 🔥 FAB */}
      <button style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: "50%",
        background: "#667eea",
        color: "white",
        fontSize: 30,
        border: "none",
        cursor: "pointer",
        boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
      }}>
        +
      </button>
    </div>
  );
}

export default Home;