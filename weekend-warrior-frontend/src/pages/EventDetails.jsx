import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getActivities } from "../api/activities";
import { API_BASE_URL } from "../config";


function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 🔥 Реальные стейты для интеграции с твоим Go-бэкендом
  const [joinStatus, setJoinStatus] = useState(""); // "joined", "pending", "waitlist"
  const [joinMessage, setJoinMessage] = useState(""); // Текст ответа от бэкенда
  const [joinError, setJoinError] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  
  // Временный фейковый массив участников для рендеринга ленты аватаров
  const [participants, setParticipants] = useState([
    { id: 1, name: "User 1", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=1" },
    { id: 2, name: "User 2", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=2" },
    { id: 3, name: "User 3", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=3" },
  ]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getActivities();
        // Приводим ID к одному регистру (бэкенд присылает ID или id)
        const current = data.find(a => (a.ID || a.id) === Number(id));
        setActivity(current);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // 🔥 ПОЛНОСТЬЮ ОБНОВЛЕННАЯ ФУНКЦИЯ ИНТЕГРАЦИИ С БЭКЕНДОМ
  const handleJoin = async () => {
    setJoinError("");
    setJoinMessage("");
    setJoinLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setJoinError("Вы должны быть авторизованы, чтобы присоединиться к активности!");
      setJoinLoading(false);
      return;
    }

    try {
      // Стучимся на твою защищенную ручку protected.POST("/activities/:id/join", ...)
      const response = await fetch(`${API_BASE_URL}/api/activities/${id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Передаем JWT-токен для AuthMiddleware
        }
      });

      const data = await response.json();

      if (response.status === 200) {
        // Успешно обработано транзакцией (статус: joined, pending или waitlist)
        setJoinStatus(data.status);
        setJoinMessage(data.message);
      } else if (response.status === 409) {
        // Сработал триггер UserAlreadyJoinedError на бэкенде
        setJoinStatus(data.status);
        setJoinError(`Вы уже подали заявку. Ваш текущий статус: ${data.status}`);
      } else {
        throw new Error(data.error || "Не удалось присоединиться к активности");
      }
    } catch (error) {
      console.error("Ошибка при вступлении:", error);
      setJoinError(error.message);
    } finally {
      setJoinLoading(false);
    }
  };

  // Генерация ссылки для кнопки "Поделиться"
  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    alert("Ссылка скопирована в буфер обмена! 🚀");
  };

  if (loading) return <div style={{ color: "white", padding: 20 }}>Загрузка...</div>;
  if (!activity) return <div style={{ color: "white", padding: 20 }}>Активность не найдена</div>;

  // Считаем лимиты мест
  const maxPeople = activity.max_people || activity.maxPeople || 10;
  const currentJoined = participants.length; 
  const isFull = currentJoined >= maxPeople;

  return (
    <div style={{
      background: "#121214",
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "sans-serif",
      color: "white"
    }}>
      {/* ВЕРХНЯЯ ПАНЕЛЬ */}
      <button 
        onClick={() => navigate(-1)}
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "white",
          padding: "10px 16px",
          borderRadius: 14,
          cursor: "pointer",
          marginBottom: 20,
          fontWeight: "600"
        }}
      >
        ← Назад
      </button>

      <div style={{
        maxWidth: 650,
        margin: "0 auto",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 28,
        padding: 24,
        boxShadow: "0 10px 40px rgba(0,0,0,0.4)"
      }}>
        
        {/* ИНФОРМАЦИОННЫЙ БЛОК */}
        <div style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: 20 }}>
          <img 
            src={`https://api.dicebear.com/7.x/identicon/svg?seed=${activity.organizer_id || activity.organizerID}`} 
            alt="Организатор" 
            style={{ width: 55, height: 55, borderRadius: "50%", background: "rgba(255,255,255,0.1)", padding: 4 }}
          />
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: "800" }}>{activity.title}</h1>
            <p style={{ margin: "4px 0 0 0", color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
              Организатор ID: {activity.organizer_id || activity.organizerID}
            </p>
          </div>
        </div>

        <p style={{ lineHeight: 1.7, color: "rgba(255,255,255,0.85)", fontSize: 16, marginBottom: 24 }}>
          {activity.description}
        </p>

        {/* СЧЕТЧИК МЕСТ */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
            <span>Заполнено мест:</span>
            <strong style={{ color: isFull ? "#f87171" : "#4ade80" }}>
              {currentJoined} из {maxPeople}
            </strong>
          </div>
          {/* Полоса прогресса */}
          <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ 
              width: `${(currentJoined / maxPeople) * 100}%`, 
              height: "100%", 
              background: isFull ? "linear-gradient(90deg, #f87171, #ef4444)" : "linear-gradient(90deg, #4ade80, #22c55e)" 
            }} />
          </div>
        </div>

        {/* СПИСОК УЧАСТНИКОВ (ЛЕНТА АВАТАРОВ) */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ margin: "0 0 10px 0", fontSize: 14, color: "rgba(255,255,255,0.6)" }}>Участники встречи:</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {participants.map(p => (
              <img 
                key={p.id}
                src={p.avatar} 
                alt={p.name}
                onClick={() => navigate(`/profile?id=${p.id}`)} // переход в профиль по клику
                title={p.name}
                style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: "50%", 
                  cursor: "pointer", 
                  border: "2px solid rgba(255,255,255,0.2)",
                  background: "rgba(0,0,0,0.3)"
                }}
              />
            ))}
          </div>
        </div>

        {/* ВИДЖЕТ КАРТЫ */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ margin: "0 0 10px 0", fontSize: 14, color: "rgba(255,255,255,0.6)" }}>📍 Место встречи на карте:</p>
          <div style={{ width: "100%", height: 200, borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
            <iframe 
              title="map"
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              marginHeight="0" 
              marginWidth="0" 
              src="https://www.openstreetmap.org/export/embed.html?bbox=74.55%2C42.84%2C74.65%2C42.89&amp;layer=mapnik&amp;marker=42.8746%2C74.6003"
              style={{ filter: "invert(90%) hue-rotate(180deg)" }} // Делаем карту крутой и ТЕМНОЙ под стиль киберпанка!
            />
          </div>
        </div>

        {/* ВЫВОД СООБЩЕНИЙ ОБ УСПЕХЕ ИЛИ ОШИБКАХ ОТ БЭКЕНДА */}
        {joinMessage && (
          <div style={{ color: "#4ade80", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", padding: "12px 16px", borderRadius: 14, marginBottom: 20, fontSize: 14 }}>
            🎉 {joinMessage}
          </div>
        )}

        {joinError && (
          <div style={{ color: "#f87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", padding: "12px 16px", borderRadius: 14, marginBottom: 20, fontSize: 14 }}>
            ⚠️ {joinError}
          </div>
        )}

        {/* КНОПКИ ДЕЙСТВИЯ */}
        <div style={{ display: "flex", gap: 12, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20 }}>
          
          <button
            onClick={handleJoin}
            disabled={joinLoading || joinStatus === "joined" || joinStatus === "pending"}
            style={{
              flex: 1,
              border: "none",
              background: joinStatus === "joined"
                ? "rgba(16, 185, 129, 0.2)" // Полупрозрачный зеленый, если уже внутри
                : joinStatus === "pending"
                ? "rgba(245, 158, 11, 0.2)" // Полупрозрачный оранжевый на модерации
                : joinStatus === "waitlist"
                ? "linear-gradient(135deg, #f59e0b, #d97706)" // Оранжевый градиент для очереди
                : "linear-gradient(135deg,#667eea,#9333c0)", // Стандартный фиолетовый
              color: joinStatus === "joined" ? "#10b981" : joinStatus === "pending" ? "#f59e0b" : "white",
              border: joinStatus === "joined" ? "1px solid rgba(16,185,129,0.4)" : joinStatus === "pending" ? "1px solid rgba(245,158,11,0.4)" : "none",
              padding: "14px",
              borderRadius: 16,
              cursor: (joinLoading || joinStatus === "joined" || joinStatus === "pending") ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: 16,
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              transition: "all 0.2s ease"
            }}
          >
            {joinLoading && "Связь с сервером..."}
            {!joinLoading && !joinStatus && (isFull ? "⏳ Встать в очередь" : "⚡ Присоединиться")}
            {!joinLoading && joinStatus === "joined" && "✓ Вы участвуете"}
            {!joinLoading && joinStatus === "pending" && "⏳ Заявка на рассмотрении"}
            {!joinLoading && joinStatus === "waitlist" && "🎒 Вы в листе ожидания"}
          </button>

          <button
            onClick={handleShare}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white",
              padding: "0 18px",
              borderRadius: 16,
              cursor: "pointer",
              fontSize: 18
            }}
            title="Поделиться"
          >
            🔗
          </button>
        </div>

      </div>
    </div>
  );
}

export default EventDetails;  