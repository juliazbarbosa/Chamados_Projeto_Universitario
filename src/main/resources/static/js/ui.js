/* Componentes de interface: avisos (toast) e cabeçalho das telas. */
function toast(m, e) {
  const d = document.createElement("div");
  d.className = "t" + (e ? " e" : "");
  d.textContent = m;
  $("#toast").append(d);
  setTimeout(() => d.remove(), 4500);
}
const main = (h) => ($("#main").innerHTML = h);
const hdr = (t, btn) => `<div class="top"><h1>${t}</h1>${btn || ""}</div>`;
