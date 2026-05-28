import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateActivity() {
  const navigate = useNavigate();
  
  // 🔥 Состояние полностью синхронизировано со структурой модели в Go
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "sports", // По умолчанию ставим "sports"
    date: "",           // В бэкенде это строка (string)
    max_people: 10      // По умолчанию 10 участников
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Ошибка безопасности: Вы не авторизованы. Войдите в систему!");
      setLoading(false);
      return;
    }

    // Подготовка объекта к отправке: парсим лимит людей в валидный Integer для Go
    const dataToSend = {
      ...formData,
      max_people: parseInt(formData.max_people, 10)
    };

    try {
      // 🔥 Запрос к твоему Gin-серверу
      const response = await fetch(`${API_BASE_URL}/api/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Токен для отработки AuthMiddleware
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        // const data = await response.json();
        const rawText = await response.text(); 
        console.log("Сырой ответ сервера при ошибке:", rawText);
        throw new Error(rawText || "Не удалось создать событие");
        throw new Error(data.error || "Не удалось создать событие");
      }

      // Если бэкенд вернул статус 201 Created — успешно уходим на главную
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: 20,
      fontFamily: "sans-serif",
      background: "#121214", // Темный фон приложения
      minHeight: "100vh",
      color: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.03)",
        padding: "30px 40px",
        borderRadius: 24,
        border: "1px solid rgba(255,255,255,0.05)",
        width: "100%",
        maxWidth: 480,
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        backdropFilter: "blur(10px)"
      }}>
        <h2 style={{ marginBottom: 10, textAlign: "center", letterSpacing: "0.5px" }}>Новое событие 🚀</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 25, fontSize: 14 }}>
          Создай активность, и она отобразится на карте и в ленте у всех пользователей.
        </p>

        {/* Вывод ошибок валидации бэкенда */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.15)",
            color: "#f87171",
            padding: "12px 16px",
            borderRadius: 12,
            marginBottom: 20,
            fontSize: 14,
            border: "1px solid rgba(239,68,68,0.3)",
            textAlign: "center"
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Название */}
          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: "500" }}>Название активности</label>
            <input
              required
              type="text"
              name="title"
              placeholder="Например: Пляжный волейбол 🏐"
              value={formData.title}
              onChange={handleChange}
              style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", color: "white", fontSize: 15, boxSizing: "border-box" }}
            />
          </div>

          {/* Описание */}
          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: "500" }}>Описание</label>
            <textarea
              required
              name="description"
              placeholder="Где собираемся, что приносить с собой и какой план действий?"
              value={formData.description}
              onChange={handleChange}
              style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", color: "white", fontSize: 15, minHeight: 90, fontFamily: "sans-serif", resize: "vertical", boxSizing: "border-box" }}
            />
          </div>

          {/* Две колонки: Категория и Лимит людей */}
          <div style={{ display: "flex", gap: 15 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: "500" }}>Категория</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", color: "white", fontSize: 15, height: 45, boxSizing: "border-box" }}
              >
                <option value="sports" style={{ background: "#1a1a1e" }}>🏆 Спорт</option>
                <option value="it" style={{ background: "#1a1a1e" }}>💻 IT / Хакатоны</option>
                <option value="boardgames" style={{ background: "#1a1a1e" }}>🎲 Настолки</option>
                <option value="walk" style={{ background: "#1a1a1e" }}>🌲 Прогулки</option>
                <option value="party" style={{ background: "#1a1a1e" }}>🎉 Встречи</option>
              </select>
            </div>

            <div style={{ width: "120px" }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: "500" }}>Мест</label>
              <input
                required
                type="number"
                name="max_people"
                min="2"
                max="999"
                value={formData.max_people}
                onChange={handleChange}
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", color: "white", fontSize: 15, height: 45, textAlignment: "center", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Время / Дата встречи */}
          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: "500" }}>Дата и время проведения</label>
            <input
              required
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", color: "white", fontSize: 15, boxSizing: "border-box" }}
            />
          </div>

          {/* Кнопка отправки */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 10,
              background: "linear-gradient(135deg, #667eea, #9333c0)",
              color: "white",
              border: "none",
              padding: "14px 20px",
              borderRadius: 14,
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: 16,
              transition: "transform 0.2s",
              boxShadow: "0 4px 15px rgba(147,51,192,0.4)"
            }}
          >
            {loading ? "Публикация..." : "Опубликовать активность"}
          </button>

          {/* Кнопка возврата */}
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              background: "transparent",
              color: "rgba(255,255,255,0.4)",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              textDecoration: "underline"
            }}
          >
            Вернуться назад
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateActivity;