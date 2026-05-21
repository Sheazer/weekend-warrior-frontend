import { API_BASE_URL } from "../config";

// Вспомогательная функция для получения токена из браузера
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    // Если токен есть — добавляем заголовок, иначе отправляем пустой объект
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

// 1. ПОЛУЧЕНИЕ ВСЕХ АКТИВНОСТЕЙ (Публичный роут, токен необязателен)
export async function getActivities() {
  const res = await fetch(`${API_BASE_URL}/activities`);
  if (!res.ok) throw new Error("Не удалось загрузить список активностей");
  return res.json();
}

// 2. СОЗДАНИЕ НОВОЙ АКТИВНОСТИ (Защищенный роут 🔒)
export async function createActivity(activityData) {
  const res = await fetch(`${API_BASE_URL}/activities`, {
    method: "POST",
    headers: getAuthHeaders(), // Автоматически подставит Bearer токен
    body: JSON.stringify(activityData),
  });
  
  if (!res.ok) {
    if (res.status === 401) throw new Error("Сессия истекла или вы не авторизованы");
    throw new Error("Ошибка при создании активности");
  }
  return res.json();
}

// 3. ПОДАЧА ЗАЯВКИ НА УЧАСТИЕ (Защищенный роут 🔒)
export async function joinActivity(activityId) {
  const res = await fetch(`${API_BASE_URL}/activities/${activityId}/join`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Для участия необходимо войти в аккаунт");
    throw new Error("Не удалось присоединиться к событию");
  }
  return res.json();
}

// 4. ПОЛУЧЕНИЕ СООБЩЕНИЙ ЧАТА (Защищенный роут 🔒)
export async function getActivityMessages(activityId) {
  const res = await fetch(`${API_BASE_URL}/activities/${activityId}/chat`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Не удалось загрузить сообщения чата");
  return res.json();
}

// 5. ОТПРАВКА СООБЩЕНИЯ В ЧАТ (Защищенный роут 🔒)
export async function createMessage(activityId, messageText) {
  const res = await fetch(`${API_BASE_URL}/activities/${activityId}/chat`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ text: messageText }), // Сверь структуру JSON со своим Go-хэндлером
  });
  if (!res.ok) throw new Error("Ошибка при отправке сообщения");
  return res.json();
}