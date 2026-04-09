import EventCard from "../components/EventCard";

function Home() {
  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      
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
        <EventCard />
        <EventCard />
        <EventCard />
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