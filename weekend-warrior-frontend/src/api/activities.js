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
export async function getActivities(params = "") {
  // Обрати внимание на обратные кавычки `` и переменную ${params} в конце URL!
  const res = await fetch(`${API_BASE_URL}/activities${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });

  if (!res.ok) throw new Error("Ошибка при получении активностей");
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

// 6. ОДОБРЕНИЕ УЧАСТНИКА (Защищенный роут 🔒)
export async function approveParticipant(activityId, userId) {
  const res = await fetch(`${API_BASE_URL}/api/activities/${activityId}/participants/${userId}/approve`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Для этого действия необходимо войти в аккаунт");
    if (res.status === 403) throw new Error("У вас нет прав для одобрения участников");
    throw new Error("Ошибка при одобрении участника");
  }
  return res.json();
}

// 7. ОТКЛОНЕНИЕ УЧАСТНИКА (Защищенный роут 🔒)
export async function rejectParticipant(activityId, userId) {
  const res = await fetch(`${API_BASE_URL}/api/activities/${activityId}/participants/${userId}/reject`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Для этого действия необходимо войти в аккаунт");
    if (res.status === 403) throw new Error("У вас нет прав для отклонения участников");
    throw new Error("Ошибка при отклонении участника");
  }
  return res.json();
}

// Обновление статуса активности
export async function updateActivityStatus(activityId, status) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/api/activities/${activityId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.  error || "Не удалось обновить статус");
  }
  return res.json();
}


// Получение полного профиля пользователя, включая его активности
export async function getUserProfile(userId) {
  const res = await fetch(`${API_BASE_URL}/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Не удалось загрузить данные профиля");
  }
  return res.json();
}