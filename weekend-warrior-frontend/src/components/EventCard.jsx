import React from "react";
import { Link } from "react-router-dom";


function EventCard({ activity }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 24,
        padding: 20,
        marginBottom: 18,
        boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
        color: "white",
        transition: "0.2s ease"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 15,
          gap: 10
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: "700"
            }}
          >
            {activity.title}
          </h2>

          <p
            style={{
              marginTop: 6,
              color: "rgba(255,255,255,0.7)",
              fontSize: 14
            }}
          >
            📅 {activity.date}
          </p>
        </div>

        <div
          style={{
            background:
              activity.status === "active"
                ? "rgba(34,197,94,0.2)"
                : "rgba(239,68,68,0.2)",
            color:
              activity.status === "active"
                ? "#4ade80"
                : "#f87171",
            padding: "6px 12px",
            borderRadius: 14,
            fontSize: 12,
            fontWeight: "bold",
            border: "1px solid rgba(255,255,255,0.08)"
          }}
        >
          {activity.status}
        </div>
      </div>

      {/* DESCRIPTION */}
      <p
        style={{
          color: "rgba(255,255,255,0.8)",
          lineHeight: 1.6,
          marginBottom: 18
        }}
      >
        {activity.description}
      </p>

      {/* TAGS */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 18
        }}
      >
        <div
          style={{
            background: "rgba(102,126,234,0.25)",
            color: "#c7d2fe",
            padding: "8px 14px",
            borderRadius: 14,
            fontSize: 13,
            fontWeight: "600"
          }}
        >
          🎯 {activity.category}
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            padding: "8px 14px",
            borderRadius: 14,
            fontSize: 13
          }}
        >
          👥 {activity.maxPeople} человек
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            padding: "8px 14px",
            borderRadius: 14,
            fontSize: 13
          }}
        >
          🛡{" "}
          {activity.needModeration
            ? "Нужна модерация"
            : "Свободный вход"}
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: 15
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "rgba(255,255,255,0.5)"
            }}
          >
            Организатор
          </p>

          <strong>ID: {activity.organizerID}</strong>
        </div>

        <button
          style={{
            border: "none",
            background:
              "linear-gradient(135deg,#667eea,#9333c0)",
            color: "white",
            padding: "10px 18px",
            borderRadius: 14,
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 14,
            boxShadow: "0 4px 14px rgba(102,126,234,0.35)"
          }}
        >
         <Link to={`/event/${activity.ID || activity.id}`}>
          <button
            style={{
              border: "none",
              background: "linear-gradient(135deg,#667eea,#9333c0)",
              color: "white",
              padding: "10px 18px",
              borderRadius: 14,
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 14,
              boxShadow: "0 4px 14px rgba(102,126,234,0.35)"
            }}
          >
            Открыть
          </button>
        </Link>
        </button>
      </div>
    </div>
  );
}

export default EventCard;