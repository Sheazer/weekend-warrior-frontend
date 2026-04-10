import { useState } from "react";

function Profile() {
  const [user] = useState({
    name: "Баха",
    bio: "Люблю спорт, технологии и новые знакомства",
    rating: 4.7,
    interests: ["Футбол", "IT", "Игры", "Путешествия"],
    events: [
      { id: 1, title: "Футбол с друзьями", status: "completed" },
      { id: 2, title: "Настольные игры", status: "planned" }
    ]
  });

  return (
    <div style={{
      padding: 20,
      fontFamily: "sans-serif",
      background: "#05050500",
      minHeight: "100vh"
    }}>
      
      {/* 🔥 HEADER */}
      <div style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        color: "white",
        padding: 25,
        borderRadius: 20,
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}>
        <div style={{
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: "white",
          margin: "0 auto 10px"
        }} />

        <h2>{user.name}</h2>
        <p>{user.bio}</p>

        <div style={{
          marginTop: 10,
          fontSize: 18
        }}>
          ⭐ {user.rating} / 5
        </div>
      </div>

      {/* 🔥 INTERESTS */}
      <div style={{ marginTop: 20 }}>
        <h3>Интересы</h3>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10
        }}>
          {user.interests.map((i, index) => (
            <div key={index} style={{
              padding: "6px 12px",
              background: "#667eea",
              color: "white",
              borderRadius: 20,
              fontSize: 14
            }}>
              {i}
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 EVENTS */}
      <div style={{ marginTop: 30 }}>
        <h3>Мои события</h3>

        {user.events.map(e => (
          <div key={e.id} style={{
            background: "white",
            padding: 15,
            marginBottom: 10,
            borderRadius: 15,
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            display: "flex",
            justifyContent: "space-between"
          }}>
            <span>{e.title}</span>

            <span style={{
              color: e.status === "completed" ? "green" : "orange"
            }}>
              {e.status}
            </span>
          </div>
        ))}
      </div>

      {/* 🔥 EDIT BUTTON */}
      <button style={{
        marginTop: 30,
        width: "100%",
        padding: 15,
        borderRadius: 15,
        border: "none",
        background: "#667eea",
        color: "white",
        fontSize: 16,
        cursor: "pointer"
      }}>
        Редактировать профиль
      </button>

    </div>
  );
}

export default Profile;