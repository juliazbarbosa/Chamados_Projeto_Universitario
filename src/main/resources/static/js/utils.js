/* Funções auxiliares: escape de HTML, formatação, ícones, etiquetas e selects. */
const $ = (s) => document.querySelector(s);
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
const fmt = (d) =>
  d ? new Date(d).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—";
const lab = (v) => String(v).replace(/_/g, " ");
const I = {
  home: "M3 11l9-8 9 8M5 10v10h14V10",
  ticket:
    "M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 000-4zM13 6v12",
  users:
    "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8M22 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8",
  tag: "M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L3 13V3h10l7.6 7.6a2 2 0 010 2.8zM7.5 7.5h.01",
  star: "M12 2l3 6.2 6.8 1-4.9 4.8 1.2 6.8L12 17.6 5.9 20.8l1.2-6.8L2.2 9.2l6.8-1z",
  plus: "M12 5v14M5 12h14",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z",
  trash: "M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14",
  back: "M19 12H5M11 6l-6 6 6 6",
};
const ic = (n) =>
  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${I[n]}"/></svg>`;
const bd = (v) => (v ? `<span class="b" data-v="${v}">${esc(lab(v))}</span>` : "—");
const so = (a) => a.map((v) => [v, lab(v)]);
const S = (o, val, blank) =>
  (blank != null ? `<option value="">${blank}</option>` : "") +
  o
    .map(
      ([a, b]) =>
        `<option value="${a}"${String(a) === String(val) ? " selected" : ""}>${esc(b)}</option>`,
    )
    .join("");
const opt = (a) => a.map((x) => [x.id, x.nome]);
const rel = (c, k) => ({ id: c[k + "Id"] ?? c[k]?.id, nome: c[k + "Nome"] ?? c[k]?.nome });
