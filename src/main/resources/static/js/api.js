/* Comunicação com o back-end (fetch) e cache dos dados carregados. */
async function api(p, o = {}) {
  const r = await fetch(API + p, {
    method: o.m || "GET",
    headers: o.b ? { "Content-Type": "application/json" } : {},
    body: o.b ? JSON.stringify(o.b) : undefined,
  });
  if (r.status === 204) return null;
  let d = null;
  try {
    d = await r.json();
  } catch {}
  if (!r.ok) {
    const x = new Error(
      [d?.erro, ...(d?.detalhes || [])].filter(Boolean).join(": ") || "Erro " + r.status,
    );
    x.status = r.status;
    throw x;
  }
  return d;
}
const list = async (p) => {
  const d = await api(p);
  return Array.isArray(d) ? d : d?.content || [];
};
const go = async (fn) => {
  try {
    return await fn();
  } catch (e) {
    toast(
      e.message === "Failed to fetch"
        ? "Não foi possível acessar a API. Confira se o Spring Boot está rodando."
        : e.message,
      1,
    );
  }
};
const D = { clientes: [], categorias: [], tecnicos: [], chamados: [] };
const load = (...ks) =>
  Promise.all(
    ks.map(async (k) => (D[k] = await list("/" + k + (k === "chamados" ? "?size=500" : "")))),
  );
