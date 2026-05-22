import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateActivityStatus } from "../api/activities";
import ReviewModal from "../components/ReviewModal";


function Profile() {
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedActivityForReview, setSelectedActivityForReview] = useState(null);

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => { 
    if (!currentUserId) {
      navigate("/login");
      return;
    }
    loadProfile();
  }, [currentUserId, navigate]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile(currentUserId);
      setProfileData(data);
    } catch (err) {
      console.error(err);
      setError("Ошибка при загрузке профиля. Возможно, сервер недоступен.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (activityId, currentStatus) => {
    let nextStatus = "active";
    if (currentStatus === "active") nextStatus = "finished";
    else if (currentStatus === "finished") nextStatus = "cancelled";

    try {
      await updateActivityStatus(activityId, nextStatus);
      
      setProfileData((prev) => ({
        ...prev,
        organized_activities: prev.organized_activities.map((act) =>
          (act.ID || act.id) === activityId ? { ...act, status: nextStatus } : act
        ),
      }));
    } catch (err) {
      alert(`Ошибка при изменении статуса: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 30, textAlign: "center", color: "#a78bfa", fontFamily: "sans-serif" }}>
        🌀 Загрузка профиля пользователя...
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div style={{ padding: 30, textAlign: "center", color: "#f87171", fontFamily: "sans-serif" }}>
        ❌ {error || "Данные не найдены"}
      </div>
    );
  }

  const { user, organized_activities = [], joined_activities = [] } = profileData;

  return (
    <div style={{
      padding: 20,
      fontFamily: "sans-serif",
      background: "#121214",
      minHeight: "100vh",
      color: "white"
    }}>
      
      {/* 🔥 TOP BAR: ПАНЕЛЬ НАВИГАЦИИ СВЕРХУ */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
      }}>
        {/* Кнопка Домой */}
        <button
          onClick={() => navigate("/")}
          style={topButtonStyle}
          onMouseEnter={(e) => e.target.style.background = "rgba(255, 255, 255, 0.1)"}
          onMouseLeave={(e) => e.target.style.background = "rgba(255, 255, 255, 0.05)"}
        >
          Anasayfa 🏠
        </button>

        {/* Кнопка Редактировать сверху с иконкой */}
        <button
          onClick={() => navigate("/profile/edit")} // Роут формы редактирования
          style={{
            ...topButtonStyle,
            color: "#60a5fa", // Выделим синеватым цветом настроек
            borderColor: "rgba(96, 165, 250, 0.2)"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(96, 165, 250, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.05)";
          }}
        >
          ⚙️ Настройки
        </button>
      </div>
      
      {/* ДИНАМИЧЕСКИЙ HEADER */}
      <div style={{
        background: "linear-gradient(135deg, #667eea, #9333c0)",
        color: "white",
        padding: 25,
        borderRadius: 24,
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
      }}>
        <div style={{
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          margin: "0 auto 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32
        }}>
          👤
        </div>

        <h2 style={{ margin: "5px 0" }}>{user.name || user.username || "Пользователь"}</h2>
        <p style={{ color: "rgba(255,255,255,0.7)", margin: "5px 0 10px" }}>
          {user.bio || "О себе: информация не заполнена"}
        </p>

        <div style={{
          background: "rgba(0,0,0,0.2)",
          display: "inline-block",
          padding: "6px 14px",
          borderRadius: 20,
          fontSize: 15
        }}>
          📧 {user.email}
        </div>
      </div>

      {/* ОРГАНИЗОВАННЫЕ СОБЫТИЯ */}
      <div style={{ marginTop: 30 }}>
        <h3 style={{ fontSize: 18, marginBottom: 12, color: "rgba(255,255,255,0.6)" }}>
          Я организую ({organized_activities.length})
        </h3>

        {organized_activities.length === 0 ? (
          <div style={emptyBlockStyle}>Вы еще не создавали активностей.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {organized_activities.map((e) => (
              <div key={e.ID || e.id} style={eventCardStyle}>
                <div>
                  <strong style={{ fontSize: 16, display: "block", marginBottom: 4 }}>{e.title}</strong>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                    📅 {e.date ? new Date(e.date).toLocaleDateString() : "Дата не указана"}
                  </span>
                </div>

                <button
                  onClick={() => handleStatusChange(e.ID || e.id, e.status)}
                  style={getStatusButtonStyle(e.status)}
                >
                  {e.status === "active" && "🟢" }
                  {e.status === "finished" && "🔵" }
                  {e.status === "cancelled" && "🔴" }
                  {" " + e.status}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* СОБЫТИЯ, КУДА ПОЛЬЗОВАТЕЛЬ ЗАПИСАН */}
    <div style={{ marginTop: 30 }}>
      <h3 style={{ fontSize: 18, marginBottom: 12, color: "rgba(255,255,255,0.6)" }}>
        Я участвую ({joined_activities.length})
      </h3>

      {joined_activities.length === 0 ? (
        <div style={emptyBlockStyle}>Вы еще не записались ни на одну активность.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {joined_activities.map((e) => (
            e && (
              <div key={e.ID || e.id} style={eventCardStyle}>
                <div>
                  <strong style={{ fontSize: 16, display: "block", marginBottom: 4 }}>{e.title}</strong>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                    📂 Категория: {e.category || "Общее"}
                  </span>
                </div>
                
                {/* Если активность завершена — даем возможность написать отзыв */}
                {e.status === "finished" ? (
                  <button
                    onClick={() => setSelectedActivityForReview({ id: e.ID || e.id, title: e.title })}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(245, 158, 11, 0.3)",
                      background: "rgba(245, 158, 11, 0.1)",
                      color: "#f59e0b",
                      fontWeight: "bold",
                      fontSize: 12,
                      cursor: "pointer"
                    }}
                  >
                    ★ Оценить
                  </button>
                ) : (
                  <span style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    color: e.status === "active" ? "#4ade80" : "#f87171"
                  }}>
                    {e.status === "active" ? "Идет сейчас" : "Отменено"}
                  </span>
                )}
              </div>
            )
          ))}
        </div>
      )}
    </div>

    {/* 🔥 МОДАЛЬНОЕ ОКНО ОТЗЫВА (рендерится только при наличии выбранной активности) */}
    {selectedActivityForReview && (
      <ReviewModal
        activityId={selectedActivityForReview.id}
        activityTitle={selectedActivityForReview.title}
        onClose={() => setSelectedActivityForReview(null)}
        onReviewSuccess={loadProfile} // Перезагрузит профиль для актуализации данных
      />
    )}

    </div>
  );
}

// Стили для верхних кнопок
const topButtonStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "#a78bfa",
  padding: "10px 16px",
  borderRadius: 14,
  fontSize: 13,
  fontWeight: "bold",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 6,
  transition: "all 0.2s ease"
};

const eventCardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: "16px 20px",
  borderRadius: 16,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const emptyBlockStyle = {
  background: "rgba(255,255,255,0.02)",
  padding: 20,
  borderRadius: 16,
  textAlign: "center",
  color: "rgba(255,255,255,0.4)",
  border: "1px solid rgba(255,255,255,0.05)"
};

const getStatusButtonStyle = (status) => {
  const isActive = status === "active";
  const isFinished = status === "finished";
  
  return {
    padding: "8px 14px",
    borderRadius: 10,
    border: "none",
    fontWeight: "bold",
    fontSize: 13,
    cursor: "pointer",
    background: isActive 
      ? "rgba(74, 222, 128, 0.15)" 
      : isFinished 
      ? "rgba(96, 165, 250, 0.15)" 
      : "rgba(248, 113, 113, 0.15)",
    color: isActive ? "#4ade80" : isFinished ? "#60a5fa" : "#f87171",
    border: `1px solid ${
      isActive 
        ? "rgba(74,222,128,0.3)" 
        : isFinished 
        ? "rgba(96,165,250,0.3)" 
        : "rgba(248,113,113,0.3)"
    }`
  };
};

export default Profile;