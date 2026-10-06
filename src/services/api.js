export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const GRAPHQL_URL = `${BASE_URL}/graphql`;
export const TOKEN_KEY = "logistech:token";

// O REST devolve documentos do Mongo com "_id"; normalizamos para "id" (igual ao GraphQL).
const withId = (v) =>
  Array.isArray(v)
    ? v.map(withId)
    : v && typeof v === "object"
    ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k === "_id" ? "id" : k, withId(x)]))
    : v;

export async function api(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  let res;
  try {
    res = await fetch(`${BASE_URL}/api${path}`, {
      method,
      headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
      body: body && JSON.stringify(body),
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor. Confira se o backend está rodando.");
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && token) window.dispatchEvent(new Event("auth:expired"));
  if (!res.ok) throw new Error(data.error || "Erro inesperado.");
  return withId(data);
}
