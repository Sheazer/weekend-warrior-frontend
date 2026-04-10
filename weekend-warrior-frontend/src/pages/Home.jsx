import EventCard from "../components/EventCard";
import { useEffect, useState } from "react";
import { getActivities } from "../api/activities";

function Home() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getActivities();
        setActivities(data);
      } catch (e) {
        console.error(e);
      }
    }

    load();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      {/* 🔥 TOP BAR */}
<div style={{
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: 10
}}>
  <button
    onClick={() => window.location.href = "/profile"}
    style={{
      background: "#9333c0",
      border: "1px solid #ddd",
      padding: "8px 12px",
      borderRadius: 20,
      cursor: "pointer",
      fontWeight: "bold",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}
  >
    👤 Профиль
  </button>
</div>
      {/* 🔥 HERO */}
      <div style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        color: "white",
        padding: 20,
        borderRadius: 20,
        marginBottom: 20
      }}>
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
          <div key={a.id} style={{
            padding: 10,
            border: "1px solid #ccc",
            marginBottom: 10,
            borderRadius: 10
          }}>
            {a.title}
          </div>
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