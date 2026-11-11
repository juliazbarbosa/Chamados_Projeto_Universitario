/* Entidades, campos dos formulários e ações de salvar, editar e excluir. */
// Entidades e campos (espelham os DTOs Request do back-end)
const E = {
  clientes: {
    t: "Clientes",
    s: "cliente",
    f: () => [
      { k: "nome", l: "Nome", max: 100, req: 1 },
      { k: "email", l: "E-mail", type: "email", max: 120, req: 1 },
      { k: "telefone", l: "Telefone", max: 20 },
    ],
    cols: [
      ["nome", "Nome"],
      ["email", "E-mail"],
      ["telefone", "Telefone"],
    ],
  },
  categorias: {
    t: "Categorias",
    s: "categoria",
    f: () => [
      { k: "nome", l: "Nome", max: 80, req: 1 },
      { k: "descricao", l: "Descrição", type: "textarea", max: 255 },
    ],
    cols: [
      ["nome", "Nome"],
      ["descricao", "Descrição"],
    ],
  },
  tecnicos: {
    t: "Técnicos",
    s: "técnico",
    f: () => [
      { k: "nome", l: "Nome", max: 100, req: 1 },
      { k: "email", l: "E-mail", type: "email", max: 120, req: 1 },
      {
        k: "perfil",
        l: "Perfil",
        type: "sel",
        o: [
          ["TECNICO", "Técnico"],
          ["ADMIN", "Administrador"],
        ],
        req: 1,
      },
    ],
    cols: [
      ["nome", "Nome"],
      ["email", "E-mail"],
      ["perfil", "Perfil"],
    ],
  },
  chamados: {
    t: "Chamados",
    s: "chamado",
    f: () => [
      { k: "titulo", l: "Título", max: 150, req: 1 },
      { k: "descricao", l: "Descrição", type: "textarea", max: 1000 },
      { k: "prioridade", l: "Prioridade", type: "sel", o: so(PR), req: 1 },
      { k: "clienteId", l: "Cliente", type: "sel", o: opt(D.clientes), req: 1 },
      { k: "categoriaId", l: "Categoria", type: "sel", o: opt(D.categorias), req: 1 },
      { k: "tecnicoId", l: "Técnico (opcional)", type: "sel", o: opt(D.tecnicos) },
    ],
  },
};
const fld = (f, v) => {
  v = v ?? "";
  const id = "f_" + f.k;
  let c;
  if (f.type === "sel")
    c = `<select id="${id}"${f.req ? " required" : ""}>${S(f.o, v, f.req ? "Selecione…" : "Nenhum")}</select>`;
  else if (f.type === "textarea")
    c = `<textarea id="${id}" rows="3" maxlength="${f.max}">${esc(v)}</textarea>`;
  else
    c = `<input id="${id}" type="${f.type || "text"}" maxlength="${f.max}" value="${esc(v)}"${f.req ? " required" : ""}>`;
  return `<label for="${id}">${f.l}${f.req ? " *" : ""}</label>${c}`;
};

async function openForm(key, item) {
  if (key === "chamados") await load("clientes", "categorias", "tecnicos");
  const e = E[key],
    fs = e.f();
  const v =
    item && key === "chamados"
      ? {
          ...item,
          clienteId: rel(item, "cliente").id,
          categoriaId: rel(item, "categoria").id,
          tecnicoId: rel(item, "tecnico").id,
        }
      : item;
  $("#dlg").innerHTML =
    `<form id="fm"><h2>${item ? "Editar" : "Novo"} ${e.s}</h2>${fs.map((f) => fld(f, v?.[f.k])).join("")}<div class="row"><button type="button" class="btn s" onclick="$('#dlg').close()">Cancelar</button><button class="btn">Salvar</button></div></form>`;
  $("#dlg").showModal();
  $("#fm").onsubmit = (ev) => {
    ev.preventDefault();
    const b = {};
    fs.forEach((f) => {
      const x = $("#f_" + f.k).value.trim();
      b[f.k] = f.k.endsWith("Id") ? (x ? +x : null) : x;
    });
    go(async () => {
      await api(`/${key}` + (item ? "/" + item.id : ""), { m: item ? "PUT" : "POST", b });
      $("#dlg").close();
      toast("Salvo com sucesso");
      render();
    });
  };
}
async function openEdit(key, id) {
  const it = D[key].find((x) => x.id == id) || (await api(`/${key}/${id}`));
  openForm(key, it);
}
function remove(key, id) {
  if (!confirm("Excluir este registro? Esta ação não pode ser desfeita.")) return;
  go(async () => {
    await api(`/${key}/${id}`, { m: "DELETE" });
    toast("Excluído");
    location.hash === "#/" + key ? render() : (location.hash = "#/" + key);
  });
}
