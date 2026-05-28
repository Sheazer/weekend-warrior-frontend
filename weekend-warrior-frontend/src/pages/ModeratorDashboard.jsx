import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActivities, approveParticipant, rejectParticipant } from "../api/activities";

function ModeratorDashboard() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [expandedActivityId, setExpandedActivityId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    loadActivities();
  }, [navigate]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await getActivities("?status=active&include=participants");
      console.log("Данные для модератора с бэка:", data);
      setActivities(data || []);
    } catch (error) {
      setMessage("Ошибка при загрузке активностей");
      setMessageType("error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (activityId, userId, userName) => {
    try {
      await approveParticipant(activityId, userId);
      setMessage(`✅ ${userName} успешно одобрен(а)`);
      setMessageType("success");
      loadActivities();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(`❌ Ошибка: ${error.message}`);
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleReject = async (activityId, userId, userName) => {
    try {
      await rejectParticipant(activityId, userId);
      setMessage(`✅ ${userName} успешно отклонен(а)`);
      setMessageType("success");
      loadActivities();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(`❌ Ошибка: ${error.message}`);
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div style={{
      padding: 20,
      fontFamily: "sans-serif",
      background: "#121214",
      minHeight: "100vh",
      color: "white"
    }}>
      {/* TOP BAR */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        background: "rgba(255,255,255,0.03)",
        padding: "10px 20px",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24 }}>📋 Панель модератора</h1>
          <p style={{ margin: "5px 0 0 0", color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
            Одобрение и отклонение заявок участников
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => navigate("/")}
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
            🏠 На главную
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userId");
              window.location.reload();
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
        </div>
      </div>

      {/* NOTIFICATION MESSAGE */}
      {message && (
        <div style={{
          marginBottom: 20,
          padding: "12px 16px",
          borderRadius: 12,
          background: messageType === "success"
            ? "rgba(74, 222, 128, 0.15)"
            : "rgba(248, 113, 113, 0.15)",
          border: `1px solid ${messageType === "success"
            ? "rgba(74, 222, 128, 0.3)"
            : "rgba(248, 113, 113, 0.3)"}`,
          color: messageType === "success" ? "#86efac" : "#fca5a5"
        }}>
          {message}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", padding: 40 }}>
          ⏳ Загрузка...
        </div>
      ) : activities.length === 0 ? (
        <div style={{
          background: "rgba(255,255,255,0.03)",
          padding: 30,
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.05)",
          textAlign: "center",
          color: "rgba(255,255,255,0.5)"
        }}>
          <p style={{ fontSize: 18 }}>У вас нет активностей с заявками 🎉</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {activities.map(activity => {
            const pendingParticipants = activity.participants?.filter(p => p.status === "pending") || [];
            const hasRequests = pendingParticipants.length > 0;

            return (
              <div key={activity.ID || activity.id} style={{
                background: "rgba(255,255,255,0.03)",
                border: hasRequests
                  ? "2px solid rgba(147,51,192,0.5)"
                  : "1px solid rgba(255,255,255,0.05)",
                borderRadius: 16,
                overflow: "hidden",
                transition: "all 0.3s ease"
              }}>
                {/* ACTIVITY HEADER */}
                <div
                  onClick={() => setExpandedActivityId(
                    expandedActivityId === (activity.ID || activity.id)
                      ? null
                      : (activity.ID || activity.id)
                  )}
                  style={{
                    padding: "16px 20px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: hasRequests
                      ? "rgba(147,51,192,0.1)"
                      : "rgba(255,255,255,0.02)",
                    borderBottom: expandedActivityId === (activity.ID || activity.id)
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "none"
                  }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: 18 }}>
                      {activity.name || activity.title || "Без названия"}
                    </h3>
                    <p style={{
                      margin: 0,
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 14
                    }}>
                      📍 {activity.location || "Местоположение не указано"}
                    </p>
                  </div>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginLeft: 20
                  }}>
                    {hasRequests && (
                      <span style={{
                        background: "#f87171",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: "bold"
                      }}>
                        {pendingParticipants.length} {pendingParticipants.length === 1 ? "заявка" : "заявок"}
                      </span>
                    )}
                    <span style={{
                      fontSize: 20,
                      transform: expandedActivityId === (activity.ID || activity.id)
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease"
                    }}>
                      ▼
                    </span>
                  </div>
                </div>

                {/* PARTICIPANTS LIST */}
                {expandedActivityId === (activity.ID || activity.id) && (
                  <div style={{ padding: "16px 20px" }}>
                    {pendingParticipants.length === 0 ? (
                      <p style={{
                        margin: 0,
                        color: "rgba(255,255,255,0.5)",
                        textAlign: "center",
                        padding: "20px 0"
                      }}>
                        Нет ожидающих заявок
                      </p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {pendingParticipants.map(participant => (
                          <div key={participant.user_id || participant.userId} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px 16px",
                            background: "rgba(255,255,255,0.05)",
                            borderRadius: 12,
                            border: "1px solid rgba(255,255,255,0.08)"
                          }}>
                            <div>
                              <p style={{ margin: 0, fontWeight: "bold", fontSize: 16 }}>
                                {participant.name || participant.user_name || "Неизвестный пользователь"}
                              </p>
                              <p style={{
                                margin: "4px 0 0 0",
                                color: "rgba(255,255,255,0.5)",
                                fontSize: 13
                              }}>
                                ID: {participant.user_id || participant.userId}
                              </p>
                            </div>

                            <div style={{
                              display: "flex",
                              gap: 8,
                              marginLeft: 20
                            }}>
                              <button
                                onClick={() => handleApprove(
                                  activity.ID || activity.id,
                                  participant.user_id || participant.userId,
                                  participant.name || participant.user_name || "Пользователь"
                                )}
                                style={{
                                  background: "rgba(74, 222, 128, 0.2)",
                                  border: "1px solid rgba(74, 222, 128, 0.4)",
                                  color: "#86efac",
                                  padding: "8px 16px",
                                  borderRadius: 8,
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                  fontSize: 13,
                                  transition: "all 0.3s ease"
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.background = "rgba(74, 222, 128, 0.3)";
                                  e.target.style.boxShadow = "0 0 10px rgba(74, 222, 128, 0.3)";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.background = "rgba(74, 222, 128, 0.2)";
                                  e.target.style.boxShadow = "none";
                                }}
                              >
                                ✅ Одобрить
                              </button>

                              <button
                                onClick={() => handleReject(
                                  activity.ID || activity.id,
                                  participant.user_id || participant.userId,
                                  participant.name || participant.user_name || "Пользователь"
                                )}
                                style={{
                                  background: "rgba(248, 113, 113, 0.2)",
                                  border: "1px solid rgba(248, 113, 113, 0.4)",
                                  color: "#f87171",
                                  padding: "8px 16px",
                                  borderRadius: 8,
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                  fontSize: 13,
                                  transition: "all 0.3s ease"
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.background = "rgba(248, 113, 113, 0.3)";
                                  e.target.style.boxShadow = "0 0 10px rgba(248, 113, 113, 0.3)";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.background = "rgba(248, 113, 113, 0.2)";
                                  e.target.style.boxShadow = "none";
                                }}
                              >
                                ❌ Отклонить
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ModeratorDashboard;
