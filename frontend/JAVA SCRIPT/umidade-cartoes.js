import { catalogoEstacoes } from './estacoes.js?v=20261105u';
import { obterLeituraCompartilhada, politicaInicialDeLeitura } from './leitura-compartilhada.js?v=20261105u';
import { normalizarLeitura, formatarHorario } from './leituras.js?v=20261105u';
import { apresentarUmidade } from './umidade.js?v=20261105u';
import { estadoDaLeitura, estadoDaFalha } from './estados.js?v=20261105u';
import { INTERVALO_ATUALIZACAO_MS } from './configuracao-api.js';
let timer, atualizando;
function mostrar(estacao, resultado) {
  const valor = document.querySelector(`[data-umidade="${estacao.id}"]`);
  const origem = document.getElementById(`origem-umidade-${estacao.id}`);
  const textos = { success: 'API', stale: 'API · desatualizado', empty: 'Sem leitura',
    error: 'Falha na consulta', offline: 'Serviço inacessível' };
  valor.textContent = apresentarUmidade(resultado.leitura?.umidade).texto;
  valor.dataset.horario = resultado.leitura?.horario || '';
  origem.textContent = textos[resultado.estado.tipo];
  valor.title = `${origem.textContent} · Leitura: ${formatarHorario(resultado.leitura?.horario)}`;
}
async function consultar(estacao, politica) {
  try {
    const dados = await obterLeituraCompartilhada(estacao, { politica });
    const leitura = dados === null ? null : normalizarLeitura(dados);
    mostrar(estacao, { leitura, estado: estadoDaLeitura(leitura) });
  } catch (erro) { mostrar(estacao, { leitura: null, estado: estadoDaFalha(erro) }); }
}
function atualizar(politica = 'reutilizar') {
  if (atualizando) return atualizando;
  clearTimeout(timer);
  atualizando = Promise.all(catalogoEstacoes.map(estacao => consultar(estacao, politica)))
    .finally(() => { atualizando = null; timer = setTimeout(() => atualizar('atualizar'), INTERVALO_ATUALIZACAO_MS); });
  return atualizando;
}
export function iniciarUmidadeCartoes() {
  atualizar(politicaInicialDeLeitura());
  window.addEventListener('pageshow', evento => { if (evento.persisted) atualizar(); });
  window.addEventListener('pagehide', () => clearTimeout(timer));
}
