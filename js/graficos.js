var chartProducaoDemanda = null;
var chartSimulacao = null;
var chartAntesDepois = null;
var chartAutonomia = null;

export function inicializarGraficos() {
    var ctxBar = document.getElementById('grafico-producao-demanda');
    if (ctxBar && typeof Chart !== 'undefined') {
        chartProducaoDemanda = new Chart(ctxBar.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['ETA Abobora (capacidade)', 'ETA Rio Verdinho (capacidade)', 'Demanda atual'],
                datasets: [{
                    label: 'Valores (m3/dia)',
                    data: [10368, 69120, 36224],
                    backgroundColor: ['#2e7d32', '#1976d2', '#f57c00']
                }]
            },
            options: { responsive: true, animation: false, scales: { y: { beginAtZero: true } } }
        });
    }

    var ctxLine = document.getElementById('grafico-simulacao');
    if (ctxLine && typeof Chart !== 'undefined') {
        chartSimulacao = new Chart(ctxLine.getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    { label: 'Producao (m3/d)', data: [], borderColor: '#2e7d32', fill: false },
                    { label: 'Demanda (m3/d)', data: [], borderColor: '#f44336', fill: false },
                    { label: 'Reservatorio (m3)', data: [], borderColor: '#2196f3', fill: false }
                ]
            },
            options: {
                responsive: true, animation: false,
                scales: {
                    x: { display: true, title: { display: true, text: 'Tempo (dias)' } },
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

export function atualizarGraficoSimulacao(estado) {
    if (!chartSimulacao) return;
    var dia = (estado.tempoSimulacao || chartSimulacao.data.labels.length) + 1;
    chartSimulacao.data.labels.push(dia.toString());
    chartSimulacao.data.datasets[0].data.push(estado.producaoEfetiva);
    chartSimulacao.data.datasets[1].data.push(estado.demandaAtual);
    chartSimulacao.data.datasets[2].data.push(estado.nivelReservatorio);
    if (chartSimulacao.data.labels.length > 50) {
        chartSimulacao.data.labels.shift();
        chartSimulacao.data.datasets.forEach(function(ds) { ds.data.shift(); });
    }
    chartSimulacao.update();
}

export function atualizarGraficoProducaoDemanda(estado) {
    if (!chartProducaoDemanda) return;
    chartProducaoDemanda.data.datasets[0].data = [estado.producaoBruta, estado.producaoEfetiva];
    chartProducaoDemanda.data.labels = ['Producao Bruta (ETA Abobora)', 'Producao Efetiva (Rio Verde)'];
    chartProducaoDemanda.update();
}

export function criarGraficoAntesDepois(canvasId, resultado) {
    if (!canvasId || typeof Chart === 'undefined') return;
    if (chartAntesDepois) { chartAntesDepois.destroy(); chartAntesDepois = null; }

    var ctx = document.getElementById(canvasId);
    if (!ctx) return;

    chartAntesDepois = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: [resultado.origem.nome + ' (origem)', resultado.destino.nome + ' (destino)'],
            datasets: [
                { label: 'Antes (m3)', data: [resultado.origem.volumeAntes, resultado.destino.volumeAntes], backgroundColor: '#94a3b8' },
                { label: 'Depois (m3)', data: [resultado.origem.volumeDepois, resultado.destino.volumeDepois], backgroundColor: '#0f3460' }
            ]
        },
        options: {
            responsive: true,
            animation: { duration: 400 },
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Volume (m3)' } } }
        }
    });
}

export function criarGraficoAutonomia(canvasId, pontos) {
    if (!canvasId || typeof Chart === 'undefined') return;
    if (chartAutonomia) { chartAutonomia.destroy(); chartAutonomia = null; }

    var ctx = document.getElementById(canvasId);
    if (!ctx) return;

    var labels = [];
    var dados = [];
    var cores = [];
    var coresMapa = { normal: '#16a34a', atencao: '#f59e0b', risco: '#f97316', critico: '#ef4444' };

    var pontosComConsumo = pontos.filter(function(p) { return p.consumo_medio_m3_dia > 0; });

    pontosComConsumo.forEach(function(p) {
        labels.push(p.nome.length > 25 ? p.nome.substring(0, 22) + '...' : p.nome);
        var autonomia = p.volume_atual_m3 / p.consumo_medio_m3_dia;
        dados.push(Math.round(autonomia * 10) / 10);
        var ocupacao = (p.volume_atual_m3 / p.capacidade_maxima_m3) * 100;
        var crit = ocupacao > 70 ? 'normal' : ocupacao > 40 ? 'atencao' : ocupacao > 20 ? 'risco' : 'critico';
        cores.push(coresMapa[crit] || '#6b7280');
    });

    chartAutonomia = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Autonomia (dias)',
                data: dados,
                backgroundColor: cores
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            animation: { duration: 400 },
            scales: { x: { beginAtZero: true, title: { display: true, text: 'Dias' } } }
        }
    });
}

export function destruirGraficosSimulador() {
    if (chartAntesDepois) { chartAntesDepois.destroy(); chartAntesDepois = null; }
    if (chartAutonomia) { chartAutonomia.destroy(); chartAutonomia = null; }
}

window.inicializarGraficos = inicializarGraficos;
window.atualizarGraficoSimulacao = atualizarGraficoSimulacao;
window.atualizarGraficoProducaoDemanda = atualizarGraficoProducaoDemanda;
window.criarGraficoAntesDepois = criarGraficoAntesDepois;
window.criarGraficoAutonomia = criarGraficoAutonomia;
window.destruirGraficosSimulador = destruirGraficosSimulador;
