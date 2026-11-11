/* Configurações: endereço da API e valores fixos (status e prioridades). */
// Se abrir o arquivo direto no navegador (file://), aponta para a API. Dentro de src/main/resources/static usa a mesma origem.
const API = location.protocol === "file:" ? "http://localhost:8080" : "";
const ST = ["ABERTO", "EM_ATENDIMENTO", "AGUARDANDO_CLIENTE", "FECHADO"],
  PR = ["BAIXA", "MEDIA", "ALTA", "CRITICA"];
