/* Menu e rotas: decide qual tela mostrar conforme o endereço (#/...). */
// ---------- Rotas ----------
const NAV = [
  ["dashboard", "Painel", "home"],
  ["chamados", "Chamados", "ticket"],
  ["clientes", "Clientes", "users"],
  ["categorias", "Categorias", "tag"],
  ["tecnicos", "Técnicos", "star"],
];
const V = {
  dashboard,
  chamados,
  chamado,
  cliente,
  clientes: () => crud("clientes"),
  categorias: () => crud("categorias"),
  tecnicos: () => crud("tecnicos"),
};
async function render() {
  const [p, id] = (location.hash.slice(2) || "dashboard").split("/");
  $("#nav").innerHTML = NAV.map(
    ([k, l, i]) =>
      `<a href="#/${k}" class="${k === p ? "on" : ""}"${k === p ? ' aria-current="page"' : ""}>${ic(i)}${l}</a>`,
  ).join("");
  const k = id ? p.slice(0, -1) : p;
  main('<p class="emp">Carregando…</p>');
  await go(() => (V[k] || dashboard)(id));
}
window.onhashchange = render;
render();
