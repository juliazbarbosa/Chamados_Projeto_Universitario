/* Telas: lista de chamados (filtros, paginação) e detalhe do chamado. */
// ---------- Chamados ----------
const F = { status: "", prioridade: "", clienteId: "", q: "", p: 0 };
const chTable = (L) =>
  L.length
    ? `<div class="tw"><table><thead><tr><th>#</th><th>Título</th><th>Cliente</th><th>Categoria</th><th>Prioridade</th><th>Status</th><th>Técnico</th><th>Abertura</th></tr></thead><tbody>${L.map((c) => `<tr><td>${c.id}</td><td><a href="#/chamados/${c.id}">${esc(c.titulo)}</a></td><td>${esc(rel(c, "cliente").nome)}</td><td>${esc(rel(c, "categoria").nome)}</td><td>${bd(c.prioridade)}</td><td>${bd(c.status)}</td><td>${esc(rel(c, "tecnico").nome || "Sem técnico")}</td><td>${fmt(c.dataAbertura)}</td></tr>`).join("")}</tbody></table></div>`
    : '<p class="emp">Nenhum chamado encontrado.</p>';
function draw() {
  const q = F.q.toLowerCase(),
    L = D.chamados
      .filter(
        (c) =>
          (!F.status || c.status === F.status) &&
          (!F.prioridade || c.prioridade === F.prioridade) &&
          (!F.clienteId || rel(c, "cliente").id == F.clienteId) &&
          (!q || (c.titulo || "").toLowerCase().includes(q)),
      )
      .sort((a, b) => b.id - a.id);
  const n = Math.max(1, Math.ceil(L.length / 8));
  F.p = Math.min(F.p, n - 1);
  $("#tbl").innerHTML =
    chTable(L.slice(F.p * 8, F.p * 8 + 8)) +
    `<div class="pg"><button class="btn s m" ${F.p ? "" : "disabled"} onclick="F.p--;draw()">Anterior</button><span>Página ${F.p + 1} de ${n}</span><button class="btn s m" ${F.p < n - 1 ? "" : "disabled"} onclick="F.p++;draw()">Próxima</button></div>`;
}
async function chamados() {
  await load("chamados", "clientes");
  main(
    hdr(
      "Chamados",
      `<button class="btn" onclick="openForm('chamados')">${ic("plus")}Novo chamado</button>`,
    ) +
      `<section class="card"><div class="fl"><input type="search" placeholder="Buscar por título" aria-label="Buscar por título" value="${esc(F.q)}" oninput="F.q=this.value;F.p=0;draw()">
 <select aria-label="Status" onchange="F.status=this.value;F.p=0;draw()">${S(so(ST), F.status, "Todos os status")}</select>
 <select aria-label="Prioridade" onchange="F.prioridade=this.value;F.p=0;draw()">${S(so(PR), F.prioridade, "Todas as prioridades")}</select>
 <select aria-label="Cliente" onchange="F.clienteId=this.value;F.p=0;draw()">${S(opt(D.clientes), F.clienteId, "Todos os clientes")}</select></div><div id="tbl"></div></section>`,
  );
  draw();
}

// ---------- Detalhe do chamado ----------
const patch = (id, acao, b, msg) =>
  go(async () => {
    await api(`/chamados/${id}/${acao}`, { m: "PATCH", b });
    toast(msg);
    render();
  });
async function chamado(id) {
  const [c, cms] = await Promise.all([
    api("/chamados/" + id),
    list(`/chamados/${id}/comentarios`).catch(() => []),
    load("tecnicos"),
  ]);
  const fe = c.status === "FECHADO",
    cl = rel(c, "cliente"),
    ca = rel(c, "categoria"),
    te = rel(c, "tecnico"),
    d = fe ? " disabled" : "";
  main(
    `<a href="#/chamados" class="btn s m" style="margin-bottom:14px">${ic("back")}Chamados</a>` +
      hdr(`#${c.id} ${esc(c.titulo)}`) +
      `<div class="two"><div class="col"><section class="card"><h2>Descrição</h2><p style="margin:0">${esc(c.descricao) || "Sem descrição."}</p></section>
 <section class="card"><h2>Comentários (${cms.length})</h2>${cms.map((m) => `<div class="cm"><b>${esc(m.autor)}</b> <small>${fmt(m.data)}</small><p style="margin:4px 0 0">${esc(m.texto)}</p></div>`).join("") || '<p class="emp">Nenhum comentário. Registre o primeiro.</p>'}
 <form id="cf"><label for="ca">Autor *</label><input id="ca" required maxlength="100"><label for="ct">Comentário *</label><textarea id="ct" rows="3" required maxlength="1000"></textarea><div class="row"><button class="btn">${ic("plus")}Adicionar comentário</button></div></form></section></div>
 <div class="col"><section class="card"><h2>Informações</h2>
 <div class="kv"><span>Status</span>${bd(c.status)}</div><div class="kv"><span>Prioridade</span>${bd(c.prioridade)}</div>
 <div class="kv"><span>Cliente</span><a href="#/clientes/${cl.id}">${esc(cl.nome)}</a></div><div class="kv"><span>Categoria</span><span>${esc(ca.nome)}</span></div>
 <div class="kv"><span>Técnico</span><span>${esc(te.nome || "Sem técnico")}</span></div><div class="kv"><span>Abertura</span><span>${fmt(c.dataAbertura)}</span></div><div class="kv"><span>Fechamento</span><span>${fmt(c.dataFechamento)}</span></div></section>
 <section class="card"><h2>Ações</h2>${fe ? '<p style="margin-top:0">Chamado fechado: não pode ser alterado nem reatribuído.</p>' : ""}
 <label for="ns">Alterar status</label><div class="ac"><select id="ns" style="flex:1"${d}>${S(so(ST), c.status)}</select><button class="btn" onclick="patch(${id},'status',{status:$('#ns').value},'Status atualizado')"${d}>Atualizar</button></div>
 <label for="nt">Atribuir técnico</label><div class="ac"><select id="nt" style="flex:1"${d}>${S(opt(D.tecnicos), te.id, "Selecione…")}</select><button class="btn" onclick="$('#nt').value?patch(${id},'atribuir',{tecnicoId:+$('#nt').value},'Técnico atribuído'):toast('Selecione um técnico',1)"${d}>Atribuir</button></div>
 <div class="row" style="justify-content:flex-start"><button class="btn s" onclick="openEdit('chamados',${id})"${d}>${ic("edit")}Editar</button><button class="btn d" onclick="remove('chamados',${id})">${ic("trash")}Excluir</button></div></section></div></div>`,
  );
  $("#cf").onsubmit = (e) => {
    e.preventDefault();
    go(async () => {
      await api(`/chamados/${id}/comentarios`, {
        m: "POST",
        b: { texto: $("#ct").value.trim(), autor: $("#ca").value.trim() },
      });
      toast("Comentário adicionado");
      render();
    });
  };
}
