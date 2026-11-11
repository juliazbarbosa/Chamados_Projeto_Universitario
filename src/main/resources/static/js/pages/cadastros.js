/* Telas: Clientes, Categorias e Técnicos. */
// ---------- Cadastros (Clientes, Categorias, Técnicos) ----------
async function crud(key) {
  await load(key);
  const e = E[key];
  main(
    hdr(e.t, `<button class="btn" onclick="openForm('${key}')">${ic("plus")}Novo ${e.s}</button>`) +
      `<section class="card">${D[key].length ? `<div class="tw"><table><thead><tr>${e.cols.map((c) => `<th>${c[1]}</th>`).join("")}<th>Ações</th></tr></thead><tbody>${D[key].map((x) => `<tr>${e.cols.map(([k]) => `<td>${k === "perfil" ? bd(x[k]) : esc(x[k])}</td>`).join("")}<td><div class="ac">${key === "clientes" ? `<a class="btn s m" href="#/clientes/${x.id}">Chamados</a>` : ""}<button class="btn s m" onclick="openEdit('${key}',${x.id})">${ic("edit")}Editar</button><button class="btn d m" onclick="remove('${key}',${x.id})">${ic("trash")}Excluir</button></div></td></tr>`).join("")}</tbody></table></div>` : `<p class="emp">Nenhum registro. Use o botão Novo ${e.s} para começar.</p>`}</section>`,
  );
}
async function cliente(id) {
  const c = await api("/clientes/" + id);
  const L = await list(`/clientes/${id}/chamados`).catch(async () => {
    await load("chamados");
    return D.chamados.filter((x) => rel(x, "cliente").id == id);
  });
  main(
    `<a href="#/clientes" class="btn s m" style="margin-bottom:14px">${ic("back")}Clientes</a>` +
      hdr(
        esc(c.nome),
        `<button class="btn" onclick="openEdit('clientes',${id})">${ic("edit")}Editar</button>`,
      ) +
      `<section class="card" style="margin-bottom:16px"><div class="kv"><span>E-mail</span><span>${esc(c.email)}</span></div><div class="kv"><span>Telefone</span><span>${esc(c.telefone) || "—"}</span></div></section><section class="card"><h2>Chamados do cliente (${L.length})</h2>${chTable(L)}</section>`,
  );
}
