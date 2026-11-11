/* Tela: Painel (resumo por status e prioridade). */
// ---------- Painel ----------
async function dashboard() {
  await load("chamados", "clientes", "tecnicos", "categorias");
  const c = D.chamados,
    n = (k, v) => c.filter((x) => x[k] === v).length,
    mx = Math.max(1, ...PR.map((p) => n("prioridade", p)));
  main(
    hdr(
      "Painel",
      `<button class="btn" onclick="openForm('chamados')">${ic("plus")}Novo chamado</button>`,
    ) +
      `<div class="grid">${ST.map((s) => `<div class="stat" data-v="${s}"><b>${n("status", s)}</b><span>${lab(s).toLowerCase()}</span></div>`).join("")}</div>
 <div class="two"><section class="card"><h2>Últimos chamados</h2>${
   c.length
     ? [...c]
         .sort((a, b) => b.id - a.id)
         .slice(0, 6)
         .map(
           (x) =>
             `<div class="kv"><a href="#/chamados/${x.id}" style="color:inherit;font-weight:700">#${x.id} ${esc(x.titulo)}</a>${bd(x.status)}</div>`,
         )
         .join("")
     : '<p class="emp">Nenhum chamado ainda. Crie o primeiro.</p>'
 }</section>
 <section class="card"><h2>Por prioridade</h2>${PR.map((p) => `<div>${bd(p)} <b>${n("prioridade", p)}</b><div class="bar"><i style="width:${(n("prioridade", p) / mx) * 100}%"></i></div></div>`).join("")}
 <p style="color:var(--mut);margin:0">${D.clientes.length} clientes · ${D.tecnicos.length} técnicos · ${D.categorias.length} categorias</p></section></div>`,
  );
}
