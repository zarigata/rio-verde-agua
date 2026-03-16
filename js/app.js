import { carregarDados, inscrever, obterEstado, simularEvento, avancarTempo, obterCidadePorId, obterTodasCidades, definirNivelReservatorio } from './simulador.js';
import { executarRedistribuicao, verificarNecessidadeRedistribuicao } from './redistribuicao.js';
import { inicializarMapa, renderizarCidades, atualizarVisualizacao, centralizarEmCidade, definirCallbackClique } from './mapa.js';
import { inicializarGraficos, atualizarGraficos, atualizarGraficoPrevisao } from './graficos.js';
import { criarModelo, treinarModelo, preverDemanda, gerarPrevisoesFuturas, calcularConfianca } from './ia.js';
import { gerarRelatorioCidade } from './hidrologia.js';

let dadosCidades = null;
let dadosHistorico = null;
let cidadeSelecionada = null;

async function inicializar() {
    await carregarDadosCidades();
    await carregarDadosHistorico();
    
    inicializarMapa('mapa');
    inicializarGraficos();
    
    if (dadosCidades && dadosHistorico) {
        carregarDados(dadosCidades.cidades, dadosCidades.conexoes);
        
        await treinarModeloIA();
    }
    
    inscrever(atualizarInterface);
    
    definirCallbackClique(aoSelecionarCidade);
    
    configurarEventosInterface();
    
    atualizarInterface(obterEstado());
}

async function carregarDadosCidades() {
    try {
        const resposta = await fetch('data/cidades.json');
        dadosCidades = await resposta.json();
    } catch (erro) {
        console.error('Erro ao carregar dados das cidades:', erro);
    }
}

async function carregarDadosHistorico() {
    try {
        const resposta = await fetch('data/historico.json');
        dadosHistorico = await resposta.json();
    } catch (erro) {
        console.error('Erro ao carregar histórico:', erro);
    }
}

async function treinarModeloIA() {
    if (!dadosHistorico || !dadosHistorico.historico) return;
    
    const dadosTreino = dadosHistorico.historico.map(registro => ({
        ...registro,
        populacao: dadosCidades.cidades.find(c => c.id === registro.cidade_id)?.populacao || 50000,
        consumo_anterior: registro.consumo_m3 * 0.95
    }));
    
    await criarModelo();
    await treinarModelo(dadosTreino);
}

function atualizarInterface(estado) {
    renderizarCidades(Object.values(estado.cidades));
    atualizarGraficos(estado);
    atualizarPainelMetricas(estado);
    atualizarPainelFormulas(estado);
    atualizarListaEventos(estado);
    
    if (cidadeSelecionada) {
        const cidadeAtualizada = estado.cidades[cidadeSelecionada.id];
        if (cidadeAtualizada) {
            atualizarPainelCidade(cidadeAtualizada);
        }
    }
}

function atualizarPainelMetricas(estado) {
    const cidades = Object.values(estado.cidades);
    
    const demandaTotal = cidades.reduce((soma, c) => soma + c.demandaAtualM3, 0);
    const producaoTotal = cidades.reduce((soma, c) => soma + c.producaoEfetivaM3, 0);
    const reservatorioTotal = cidades.reduce((soma, c) => soma + c.nivel_atual_reservatorio_m3, 0);
    const cidadesCriticas = cidades.filter(c => c.status === 'critico').length;
    
    const elementoDemanda = document.getElementById('metrica-demanda-total');
    const elementoProducao = document.getElementById('metrica-producao-total');
    const elementoReservatorio = document.getElementById('metrica-reservatorio-total');
    const elementoCriticas = document.getElementById('metrica-cidades-criticas');
    
    if (elementoDemanda) elementoDemanda.textContent = demandaTotal.toLocaleString('pt-BR') + ' m³/dia';
    if (elementoProducao) elementoProducao.textContent = producaoTotal.toLocaleString('pt-BR') + ' m³/dia';
    if (elementoReservatorio) elementoReservatorio.textContent = reservatorioTotal.toLocaleString('pt-BR') + ' m³';
    if (elementoCriticas) elementoCriticas.textContent = cidadesCriticas + ' cidade(s)';
    
    const elementoTempo = document.getElementById('tempo-simulacao');
    if (elementoTempo) {
        elementoTempo.textContent = `${estado.tempoSimulacao.dia}/${estado.tempoSimulacao.mes}/${estado.tempoSimulacao.ano}`;
    }
}

function atualizarPainelFormulas(estado) {
    const painel = document.getElementById('painel-formulas');
    if (!painel) return;
    
    const cidades = Object.values(estado.cidades);
    if (cidades.length === 0) return;
    
    const cidadeExemplo = cidades[0];
    const relatorio = gerarRelatorioCidade({
        ...cidadeExemplo,
        populacao: cidadeExemplo.populacao,
        consumo_medio_litros_dia: 150,
        fator_industrial: cidadeExemplo.fator_industrial || 1.0
    });
    
    painel.innerHTML = `
        <div class="formula-item">
            <h4>Cálculo de Demanda</h4>
            <code>${relatorio.formulas.demanda}</code>
        </div>
        <div class="formula-item">
            <h4>Produção Efetiva</h4>
            <code>${relatorio.formulas.producaoEfetiva}</code>
        </div>
        <div class="formula-item">
            <h4>Índice de Estresse Hídrico</h4>
            <code>${relatorio.formulas.ieh}</code>
        </div>
    `;
}

function atualizarListaEventos(estado) {
    const lista = document.getElementById('lista-eventos');
    if (!lista) return;
    
    const eventos = estado.historicoEventos.slice(-5).reverse();
    
    lista.innerHTML = eventos.map(e => `
        <div class="evento-item">
            <span class="evento-tipo">${formatarTipoEvento(e.tipo)}</span>
            <span class="evento-tempo">${e.tempoSimulacao.dia}/${e.tempoSimulacao.mes}/${e.tempoSimulacao.ano}</span>
        </div>
    `).join('') || '<p>Nenhum evento registrado</p>';
}

function formatarTipoEvento(tipo) {
    const nomes = {
        'seca': 'Seca',
        'chuva_intensa': 'Chuva Intensa',
        'crescimento_populacional': 'Crescimento Pop.',
        'aumento_industrial': 'Aumento Industrial',
        'quebra_reservatorio': 'Quebra de Reservatório',
        'cidade_sem_agua': 'Cidade sem Água'
    };
    return nomes[tipo] || tipo;
}

function aoSelecionarCidade(cidade) {
    cidadeSelecionada = cidade;
    atualizarPainelCidade(cidade);
    centralizarEmCidade(cidade.id);
}

async function atualizarPainelCidade(cidade) {
    const painel = document.getElementById('painel-cidade');
    if (!painel) return;
    
    const relatorio = gerarRelatorioCidade({
        ...cidade,
        consumo_medio_litros_dia: 150
    });
    
    const previsoes = await gerarPrevisoesFuturas(cidade, 7);
    const confianca = calcularConfianca(previsoes);
    
    const dadosHistoricoGrafico = previsoes.map(p => p.demandaPrevista * 0.95);
    const dadosPrevisao = previsoes.map(p => p.demandaPrevista);
    atualizarGraficoPrevisao(dadosHistoricoGrafico, dadosPrevisao);
    
    painel.innerHTML = `
        <h3>${cidade.nome}</h3>
        <div class="cidade-metricas">
            <div class="metrica">
                <span class="label">População</span>
                <span class="valor">${cidade.populacao.toLocaleString('pt-BR')}</span>
            </div>
            <div class="metrica">
                <span class="label">Demanda</span>
                <span class="valor">${cidade.demandaAtualM3.toLocaleString('pt-BR')} m³/dia</span>
            </div>
            <div class="metrica">
                <span class="label">Produção</span>
                <span class="valor">${cidade.producaoEfetivaM3.toLocaleString('pt-BR')} m³/dia</span>
            </div>
            <div class="metrica">
                <span class="label">Reservatório</span>
                <span class="valor">${cidade.nivel_atual_reservatorio_m3.toLocaleString('pt-BR')} m³</span>
            </div>
            <div class="metrica">
                <span class="label">Status</span>
                <span class="valor status-${cidade.status}">${cidade.status.toUpperCase()}</span>
            </div>
            <div class="metrica">
                <span class="label">Confiança IA</span>
                <span class="valor">${confianca}%</span>
            </div>
        </div>
        <div class="cidade-controles">
            <label>Nível do Reservatório:</label>
            <input type="range" id="controle-reservatorio" min="0" max="${cidade.capacidade_reservatorio_m3}" 
                   value="${cidade.nivel_atual_reservatorio_m3}" step="100">
            <span id="valor-reservatorio">${cidade.nivel_atual_reservatorio_m3.toLocaleString('pt-BR')} m³</span>
        </div>
    `;
    
    const slider = document.getElementById('controle-reservatorio');
    if (slider) {
        slider.addEventListener('input', (e) => {
            const novoNivel = parseInt(e.target.value);
            document.getElementById('valor-reservatorio').textContent = novoNivel.toLocaleString('pt-BR') + ' m³';
            definirNivelReservatorio(cidade.id, novoNivel);
        });
    }
}

function configurarEventosInterface() {
    document.getElementById('btn-seca')?.addEventListener('click', () => {
        simularEvento('seca', cidadeSelecionada?.id, { intensidade: 0.4 });
        verificarRedistribuicaoAutomatica();
    });
    
    document.getElementById('btn-chuva')?.addEventListener('click', () => {
        simularEvento('chuva_intensa', cidadeSelecionada?.id, { intensidade: 1.4 });
    });
    
    document.getElementById('btn-crescimento')?.addEventListener('click', () => {
        simularEvento('crescimento_populacional', cidadeSelecionada?.id, { taxa: 0.1 });
        verificarRedistribuicaoAutomatica();
    });
    
    document.getElementById('btn-industrial')?.addEventListener('click', () => {
        simularEvento('aumento_industrial', cidadeSelecionada?.id, { fator: 0.15 });
        verificarRedistribuicaoAutomatica();
    });
    
    document.getElementById('btn-quebra')?.addEventListener('click', () => {
        simularEvento('quebra_reservatorio', cidadeSelecionada?.id, { percentualPerda: 0.5 });
        verificarRedistribuicaoAutomatica();
    });
    
    document.getElementById('btn-sem-agua')?.addEventListener('click', () => {
        simularEvento('cidade_sem_agua', cidadeSelecionada?.id);
        verificarRedistribuicaoAutomatica();
    });
    
    document.getElementById('btn-redistribuir')?.addEventListener('click', () => {
        const resultado = executarRedistribuicao();
        mostrarNotificacao(`Redistribuição concluída: ${resultado.volumeTotalTransferido.toLocaleString('pt-BR')} m³ transferidos`);
    });
    
    document.getElementById('btn-avancar-hora')?.addEventListener('click', () => {
        avancarTempo('hora', 1);
    });
    
    document.getElementById('btn-avancar-dia')?.addEventListener('click', () => {
        avancarTempo('dia', 1);
        verificarRedistribuicaoAutomatica();
    });
    
    document.getElementById('btn-avancar-mes')?.addEventListener('click', () => {
        avancarTempo('mes', 1);
        verificarRedistribuicaoAutomatica();
    });
    
    document.getElementById('btn-avancar-ano')?.addEventListener('click', () => {
        avancarTempo('ano', 1);
        verificarRedistribuicaoAutomatica();
    });
    
    document.getElementById('btn-reiniciar')?.addEventListener('click', () => {
        location.reload();
    });
}

function verificarRedistribuicaoAutomatica() {
    const necessidade = verificarNecessidadeRedistribuicao();
    
    if (necessidade.necessitaRedistribuicao) {
        const resultado = executarRedistribuicao();
        if (resultado.volumeTotalTransferido > 0) {
            mostrarNotificacao(`Redistribuição automática: ${resultado.volumeTotalTransferido.toLocaleString('pt-BR')} m³`, 'info');
        }
    }
}

function mostrarNotificacao(mensagem, tipo = 'success') {
    const container = document.getElementById('notificacoes');
    if (!container) return;
    
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.textContent = mensagem;
    
    container.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', inicializar);

export {
    inicializar,
    aoSelecionarCidade,
    mostrarNotificacao
};
