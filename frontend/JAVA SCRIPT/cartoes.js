import { localidades } from './dados-demonstrativos.js?v=20261105u';
import { icone } from './icones.js?v=20261105u';
const clima = { Ensolarado: 'light', 'Parcialmente nublado': 'partly-cloudy',
  'Chuva leve': 'rain', Nublado: 'cloud' };
function medicao(titulo, valor, simbolo) {
  return `<div><dt>${icone(simbolo)}${titulo}</dt><dd>${valor}</dd></div>`;
}
function conteudo(local) {
  const temperatura = Number.isFinite(local.temperatura) ? `${local.temperatura} °C` : 'Indisponível';
  return `<div class="clima">
    <img class="foto-localidade" src="${local.imagem}" alt="Paisagem de ${local.nome}"
      width="720" height="960" loading="lazy" decoding="async" draggable="false">
    <div class="condicoes-cartao">${icone(clima[local.condicao] || 'cloud', 'icone icone-clima')}
      <p class="temperatura-cartao">${temperatura}</p><p>${local.condicao || 'Condição indisponível'}</p></div>
    <div class="identificacao-localidade"><h3>${local.nome}</h3><p class="estado">${local.uf}</p></div></div>
    <div class="detalhes-localidade"><dl class="resumo-localidade">
      <div><dt>${icone('humidity')}Umidade</dt><dd data-umidade="${local.id}"
        aria-describedby="origem-umidade-${local.id}">Indisponível</dd>
        <dd class="origem-umidade" id="origem-umidade-${local.id}">Sem leitura</dd></div>${medicao('Qualidade do ar', 'Indisponível', 'air')}</dl>
      <a class="selecionar" href="${local.rota}">Ver clima completo
        <span class="sr-only"> de ${local.nome}</span>${icone('arrow-right')}</a></div>`;
}
export function criarCartoes() {
  document.getElementById('lista-localidades').innerHTML = localidades.map(local =>
    `<li class="localidade" data-localidade="${local.id}"><article>
      ${conteudo(local)}</article></li>`).join('');
  localidades.forEach(local => {
    document.querySelector(`[data-localidade="${local.id}"] img`).style.objectPosition = local.posicao;
  });
}
