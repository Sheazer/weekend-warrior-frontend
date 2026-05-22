import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";
import { getActivities } from "../api/activities";

function Home() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function load() {
      try {
        const data = await getActivities();
        setActivities(data || []);
      } catch (error) {
        console.error("Ошибка загрузки активностей:", error);
      }
    }
    load();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.reload();
  };

  return (
    <div style={styles.container}>
      
      {/* 🧭 NAVIGATION TOP BAR */}
      <header style={styles.topBar}>
        <div style={styles.statusBlock}>
          <div style={{ ...styles.statusDot, background: token ? "#4ade80" : "#f87171", boxShadow: token ? "0 0 8px #4ade80" : "0 0 8px #f87171" }} />
          <span style={styles.statusText}>{token ? `ID: ${userId}` : "Гость"}</span>
        </div>

        <div style={styles.actionsBlock}>
          <button onClick={() => navigate("/map")} style={styles.btnSecondary}>🗺️ Карта</button>
          
          {token ? (
            <>
              <button onClick={() => navigate("/profile")} style={styles.btnPrimary}>👤 Профиль</button>
              <button onClick={() => navigate("/moderator")} style={styles.btnPurple}>📋 Модератор</button>
              <button onClick={handleLogout} style={styles.btnDanger}>🚪 Выйти</button>
            </>
          ) : (
            <button onClick={() => navigate("/login")} style={styles.btnAccent}>🔑 Войти</button>
          )}
        </div>
      </header>

      {/* 🚀 HERO SECTION & SEARCH */}
      <section style={styles.heroCard}>
        <h1 style={styles.heroTitle}>Найди событие рядом 🚀</h1>
        <input placeholder="Поиск событий..." style={styles.searchInput} />
      </section>

      {/* 🎛️ FILTERS & RADIUS PANEL */}
      <section style={styles.filterPanel}>
        <div style={styles.filterGroup}>
          {["Сегодня", "Завтра", "Выходные", "Бесплатно"].map(f => (
            <button key={f} style={styles.filterBadge}>{f}</button>
          ))}
        </div>
        
        <div style={styles.radiusGroup}>
          <span style={styles.radiusText}>Радиус: 10 км</span>
          <input type="range" min="1" max="10" style={styles.rangeInput} />
        </div>
      </section>

      {/* 📋 ACTIVITIES LIST */}
      <main style={styles.listContainer}>
        {activities.length === 0 ? (
          <p style={styles.emptyText}>Активностей не найдено 🛌</p>
        ) : (
          activities.map(a => <EventCard key={a.ID || a.id} activity={a} />)
        )}
      </main>

      {/* ➕ FLOATING ACTION BUTTON */}
      <button onClick={() => navigate("/create")} style={styles.fabButton} title="Создать событие">+</button>
    </div>
  );
}

// ✨ ИЗОЛИРОВАННЫЕ СТИЛИ ИНТЕРФЕЙСА (CLEAN CODE)
const styles = {
  container: {
    padding: "20px 24px",
    fontFamily: "system-ui, -apple-system, sans-serif",
    background: "#121214",
    minHeight: "100vh",
    color: "#ffffff",
    boxSizing: "border-box"
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    background: "rgba(255, 255, 255, 0.02)",
    padding: "12px 16px",
    borderRadius: 16,
    border: "1px solid rgba(255, 255, 255, 0.05)"
  },
  statusBlock: {
    display: "flex",
    alignItems: "center",
    gap: 8
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%"
  },
  statusText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500"
  },
  actionsBlock: {
    display: "flex",
    gap: 8
  },
  
  // КНОПКИ НАВИГАЦИИ
  btnPrimary: {
    background: "rgba(255, 255, 255, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#fff",
    padding: "6px 14px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: "600",
    cursor: "pointer"
  },
  btnSecondary: {
    background: "transparent",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    color: "rgba(255, 255, 255, 0.8)",
    padding: "6px 14px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: "600",
    cursor: "pointer"
  },
  btnPurple: {
    background: "rgba(147, 51, 192, 0.15)",
    border: "1px solid rgba(147, 51, 192, 0.3)",
    color: "#d4a5ff",
    padding: "6px 14px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: "600",
    cursor: "pointer"
  },
  btnDanger: {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.25)",
    color: "#f87171",
    padding: "6px 14px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: "600",
    cursor: "pointer"
  },
  btnAccent: {
    background: "linear-gradient(135deg, #667eea, #9333c0)",
    border: "none",
    color: "#fff",
    padding: "6px 16px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: "600",
    cursor: "pointer"
  },

  // HERO БЛОК
  heroCard: {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    padding: "24px",
    borderRadius: 20,
    marginBottom: 20,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)"
  },
  heroTitle: {
    fontSize: "24px",
    margin: "0 0 14px 0",
    fontWeight: "800",
    letterSpacing: "-0.5px"
  },
  searchInput: {
    padding: "12px 16px",
    borderRadius: 12,
    border: "none",
    width: "100%",
    background: "rgba(255, 255, 255, 0.12)",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box"
  },

  // ФИЛЬТРЫ И РАДИУС
  filterPanel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
    flexWrap: "wrap"
  },
  filterGroup: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap"
  },
  filterBadge: {
    padding: "6px 14px",
    borderRadius: 20,
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "rgba(147, 51, 192, 0.2)",
    color: "#e9d5ff",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer"
  },
  radiusGroup: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "rgba(255, 255, 255, 0.02)",
    padding: "6px 14px",
    borderRadius: 20,
    border: "1px solid rgba(255, 255, 255, 0.04)"
  },
  radiusText: {
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.5)"
  },
  rangeInput: {
    cursor: "pointer",
    accentColor: "#9333c0"
  },

  // ЛИСТ
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 12
  },
  emptyText: {
    color: "rgba(255, 255, 255, 0.3)",
    textAlign: "center",
    marginTop: 40,
    fontSize: "14px"
  },

  // КНОПКА ДОБАВЛЕНИЯ (FAB)
  fabButton: {
    position: "fixed",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4f46e5, #9333c0)",
    color: "#fff",
    fontSize: "28px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(147, 51, 192, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease"
  }
};

export default Home;