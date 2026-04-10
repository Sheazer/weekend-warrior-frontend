const BASE_URL = "http://localhost:8080/api";

export async function getActivities() {
  const res = await fetch(`${BASE_URL}/activities`);
  if (!res.ok) throw new Error("Ошибка запроса");
  return res.json();
}