import { carregarDados, obterInfraestrutura, obterIndicadores, obterFontes } from './data.js';
import { inicializarMapa, renderizarInfraestrutura } from './mapa.js';
import { inicializarGraficos, atualizarGraficoSimulacao, atualizarGraficoProducaoDemanda } from './graficos.js';
import { inicializarSimulacao, inscrever, obterEstado, simularEvento, avancarTempo, reiniciarSimulacao } from './simulador.js';

/**
 * app.js — Orquestrador principal
 * Coordena dados, mapa, gráficos, simulação e renderização da UI.
 */

// ── Renderização da tabela de infraestrutura ──────────────────────────────

function renderizarTabela(itens) {
  const container = document.getElementById('tabela-infraestrutura');
  if (!container) return;

  const tipoLabel = {
    captacao: 'Captação',
    captacao_natural: 'Manancial',
    tratamento: 'Tratamento',
    reservacao: 'Reservação',
    tratamento_esgoto: 'Tratamento de Esgoto',
    distribuicao: 'Distribuição'
  };

  const certezaCores = {
    confirmed: 'var(--cor-confirmado)',
    derived: 'var(--cor-derivado)',
    approximate: 'var(--cor-aproximado)'
  };

  const certezaLabels = {
    confirmed: 'Confirmado',
    derived: 'Derivado',
    approximate: 'Aproximado'
  };

  const statusLabels = {
    operacional: 'Operacional',
    em_construcao: 'Em construção'
  };

  const html = `
    <div class="tabela-responsiva">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Capacidade</th>
            <th>Certeza</th>
            <th>Status</th>
            <th>Fonte</th>
          </tr>
        </thead>
        <tbody>
          ${itens.map(item => `
            <tr>
              <td><strong>${item.nome}</strong><br><small style="color:var(--cor-texto-claro)">${item.endereco_aproximado || ''}</small></td>
              <td>${tipoLabel[item.tipo] || item.tipo}</td>
              <td>${item.capacidade_valor != null ? `${item.capacidade_valor} ${item.capacidade_unidade}` : '—'}</td>
              <td>
                <span style="display:inline-flex;align-items:center;gap:0.3rem;">
                  <span style="width:8px;height:8px;border-radius:50%;background:${certezaCores[item.certeza_nivel] || '#999'};display:inline-block;"></span>
                  ${certezaLabels[item.certeza_nivel] || item.certeza_nivel}
                </span>
              </td>
              <td>${statusLabels[item.status_operacional] || item.status_operacional}</td>
              <td><a href="${item.fonte_url}" target="_blank" rel="noopener">${item.fonte_titulo ? item.fonte_titulo.substring(0, 50) + '...' : 'Ver fonte'}</a></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
}

// ── Renderização dos indicadores municipais ──────────────────────────────

function renderizarIndicadores(indicadores) {
  const container = document.getElementById('indicadores-container');
  if (!container) return;

  const linhas = [
    { label: 'População total', valor: indicadores.populacao_total?.toLocaleString('pt-BR') + ' hab', fonte: indicadores.populacao_fonte },
    { label: 'Cobertura água (urbana)', valor: indicadores.cobertura_agua_urbana_percentual + '%', fonte: indicadores.cobertura_agua_fonte },
    { label: 'Cobertura esgoto (urbana)', valor: indicadores.cobertura_esgoto_urbana_percentual + '%', fonte: indicadores.cobertura_esgoto_fonte },
    { label: 'Rede coletora', valor: indicadores.rede_coletora_km + ' km', fonte: indicadores.rede_coletora_fonte },
    { label: 'Esgoto tratado', valor: indicadores.esgoto_tratado_milhoes_litros_dia + ' milhões L/dia', fonte: indicadores.esgoto_tratado_fonte },
    { label: 'Consumo médio per capita', valor: indicadores.consumo_medio_litros_dia + ' L/hab/dia', fonte: indicadores.consumo_medio_fonte },
    { label: 'Extensão rede água', valor: Number(indicadores.extensao_rede_agua_m).toLocaleString('pt-BR') + ' m', fonte: indicadores.extensao_rede_agua_fonte },
    { label: 'Extensão rede esgoto', valor: Number(indicadores.extensao_rede_esgoto_m).toLocaleString('pt-BR') + ' m', fonte: indicadores.extensao_rede_esgoto_fonte },
    { label: 'Ligações água', valor: Number(indicadores.conexoes_agua).toLocaleString('pt-BR'), fonte: indicadores.conexoes_agua_fonte },
    { label: 'Ligações esgoto', valor: Number(indicadores.conexoes_esgoto).toLocaleString('pt-BR'), fonte: indicadores.conexoes_esgoto_fonte }
  ];

  container.innerHTML = `
    <div class="tabela-responsiva">
      <table>
        <thead>
          <tr><th>Indicador</th><th>Valor</th><th>Fonte</th></tr>
        </thead>
        <tbody>
          ${linhas.map(l => `
            <tr>
              <td>${l.label}</td>
              <td><strong>${l.valor}</strong></td>
              <td><small style="color:var(--cor-texto-claro)">${l.fonte || '—'}</small></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ── Renderização das fontes ───────────────────────────────────────────────

function renderizarFontes(fontes) {
  const container = document.getElementById('fontes-container');
  if (!container) return;

  container.innerHTML = fontes.map(f => `
    <div class="fonte-item">
      <h4>${f.titulo}</h4>
      <p><strong>Autor:</strong> ${f.autor || '—'} | <strong>Tipo:</strong> ${f.tipo || '—'} | <strong>Data:</strong> ${f.data_publicacao || '—'}</p>
      <p><strong>URL:</strong> <a href="${f.url}" target="_blank" rel="noopener">${f.url}</a></p>
      <p><strong>Status de acesso:</strong> ${f.status_acesso || '—'}</p>
      <p><strong>Acessado em:</strong> ${f.acessado_em || '—'}</p>
      ${f.dados_extraidos && f.dados_extraidos.length > 0 ? `
        <p><strong>Dados extraídos:</strong></p>
        <ul>${f.dados_extraidos.map(d => `<li>${d}</li>`).join('')}</ul>
      ` : ''}
      ${f.observacao ? `<p style="color:var(--cor-aproximado);font-weight:600;">${f.observacao}</p>` : ''}
    </div>
  `).join('');
}

// ── Atualização do status da simulação ────────────────────────────────────

function atualizarStatus(estado) {
  if (!estado) return;

  const el = document.getElementById('simulacao-status');
  if (el) {
    el.innerHTML = `
      <strong>${estado.municipio}</strong> — Dia ${estado.tempoSimulacao}<br>
      População: ${estado.populacao.toLocaleString('pt-BR')} hab |
      Demanda: ${Math.round(estado.demandaAtual).toLocaleString('pt-BR')} m³/dia |
      Produção: ${Math.round(estado.producaoEfetiva).toLocaleString('pt-BR')} m³/dia |
      Reservatório: ${Math.round(estado.nivelReservatorio).toLocaleString('pt-BR')} m³
    `;
  }

  const listaEl = document.getElementById('lista-eventos');
  if (listaEl && estado.historicoEventos) {
    const eventos = estado.historicoEventos.slice(-10).reverse();
    if (eventos.length === 0) {
      listaEl.innerHTML = '<p class="evento-vazio">Nenhum evento registrado</p>';
    } else {
      const nomes = {
        seca: 'Seca',
        chuva_intensa: 'Chuva Intensa',
        crescimento_populacional: 'Crescimento Pop.',
        aumento_industrial: 'Aumento Industrial',
        quebra_reservatorio: 'Quebra de Reservatório'
      };
      listaEl.innerHTML = eventos.map(e => `
        <div class="evento-vazio" style="padding:0.3rem 0;border-bottom:1px solid var(--cor-borda);">
          <strong>Dia ${e.dia}:</strong> ${nomes[e.evento] || e.evento}
        </div>
      `).join('');
    }
  }
}

// ── Notificações ──────────────────────────────────────────────────────────

function mostrarNotificacao(mensagem, tipo = 'success') {
  const container = document.getElementById('notificacoes');
  if (!container) return;

  const notif = document.createElement('div');
  notif.className = `notificacao notificacao-${tipo}`;
  notif.textContent = mensagem;
  container.appendChild(notif);

  setTimeout(() => notif.remove(), 3500);
}

// ── Inicialização ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const dados = await carregarDados();

    // Mapa
    inicializarMapa('mapa');
    renderizarInfraestrutura(dados.infraestrutura);

    // Tabela de infraestrutura
    renderizarTabela(dados.infraestrutura);

    // Indicadores municipais
    renderizarIndicadores(dados.indicadores);

    // Fontes
    renderizarFontes(dados.fontes);

    // Gráficos
    inicializarGraficos();

    // Simulação
    inicializarSimulacao();

    // Assinar atualizações da simulação
    inscrever((estado) => {
      atualizarGraficoSimulacao(estado);
      atualizarGraficoProducaoDemanda(estado);
      atualizarStatus(estado);
    });

    // ── Eventos da simulação ──

    document.getElementById('btn-seca')?.addEventListener('click', () => {
      simularEvento('seca');
      mostrarNotificacao('Evento simulado: Seca — produção reduzida em 40%', 'info');
    });

    document.getElementById('btn-chuva')?.addEventListener('click', () => {
      simularEvento('chuva_intensa');
      mostrarNotificacao('Evento simulado: Chuva Intensa — produção aumentada em 40%', 'info');
    });

    document.getElementById('btn-crescimento')?.addEventListener('click', () => {
      simularEvento('crescimento_populacional');
      mostrarNotificacao('Evento simulado: Crescimento Populacional +2%', 'info');
    });

    document.getElementById('btn-industrial')?.addEventListener('click', () => {
      simularEvento('aumento_industrial');
      mostrarNotificacao('Evento simulado: Aumento Industrial +15%', 'info');
    });

    document.getElementById('btn-quebra')?.addEventListener('click', () => {
      simularEvento('quebra_reservatorio');
      mostrarNotificacao('Evento simulado: Quebra de Reservatório — perda de 10%', 'info');
    });

    // ── Controle de tempo ──

    document.getElementById('btn-avancar-dia')?.addEventListener('click', () => {
      avancarTempo(1);
    });

    document.getElementById('btn-avancar-mes')?.addEventListener('click', () => {
      avancarTempo(30);
    });

    document.getElementById('btn-avancar-ano')?.addEventListener('click', () => {
      avancarTempo(365);
    });

    document.getElementById('btn-reiniciar')?.addEventListener('click', () => {
      reiniciarSimulacao();
      mostrarNotificacao('Simulação reiniciada', 'success');
    });

  } catch (erro) {
    console.error('Falha na inicialização:', erro);
    mostrarNotificacao('Erro ao carregar dados. Verifique o console.', 'error');
  }
});
