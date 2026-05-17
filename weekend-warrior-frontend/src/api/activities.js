import { API_BASE_URL } from "../config";

export async function getActivities() {
  const res = await fetch(`${API_BASE_URL}/activities`);
  if (!res.ok) throw new Error("Ошибка запроса");
  return res.json();
}