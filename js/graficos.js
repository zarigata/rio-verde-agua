import { obterTodasCidades, obterEstado } from './simulador.js';

let graficoDemanda = null;
let graficoProducao = null;
let graficoFluxos = null;
let graficoPrevisao = null;

function inicializarGraficos() {
    criarGraficoDemanda();
    criarGraficoProducao();
    criarGraficoFluxos();
    criarGraficoPrevisao();
}

function criarGraficoDemanda() {
    const ctx = document.getElementById('grafico-demanda');
    if (!ctx) return;
    
    graficoDemanda = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Demanda (m³/dia)',
                data: [],
                backgroundColor: 'rgba(220, 53, 69, 0.7)',
                borderColor: 'rgba(220, 53, 69, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Demanda de Água por Cidade',
                    font: { size: 14 }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'm³/dia'
                    }
                }
            }
        }
    });
}

function criarGraficoProducao() {
    const ctx = document.getElementById('grafico-producao');
    if (!ctx) return;
    
    graficoProducao = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Produção (m³/dia)',
                    data: [],
                    backgroundColor: 'rgba(40, 167, 69, 0.7)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Demanda (m³/dia)',
                    data: [],
                    backgroundColor: 'rgba(255, 193, 7, 0.7)',
                    borderColor: 'rgba(255, 193, 7, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Produção vs Demanda',
                    font: { size: 14 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'm³/dia'
                    }
                }
            }
        }
    });
}

function criarGraficoFluxos() {
    const ctx = document.getElementById('grafico-fluxos');
    if (!ctx) return;
    
    graficoFluxos = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    'rgba(0, 123, 255, 0.7)',
                    'rgba(40, 167, 69, 0.7)',
                    'rgba(255, 193, 7, 0.7)',
                    'rgba(220, 53, 69, 0.7)',
                    'rgba(108, 117, 125, 0.7)',
                    'rgba(23, 162, 184, 0.7)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribuição de Reservatórios',
                    font: { size: 14 }
                }
            }
        }
    });
}

function criarGraficoPrevisao() {
    const ctx = document.getElementById('grafico-previsao');
    if (!ctx) return;
    
    graficoPrevisao = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Demanda Real',
                    data: [],
                    borderColor: 'rgba(220, 53, 69, 1)',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Previsão IA',
                    data: [],
                    borderColor: 'rgba(0, 123, 255, 1)',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    borderDash: [5, 5],
                    tension: 0.3,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Previsão de Demanda (IA)',
                    font: { size: 14 }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'm³/dia'
                    }
                }
            }
        }
    });
}

function atualizarGraficos(estado) {
    const cidades = Object.values(estado.cidades);
    
    atualizarGraficoDemanda(cidades);
    atualizarGraficoProducao(cidades);
    atualizarGraficoFluxos(cidades);
}

function atualizarGraficoDemanda(cidades) {
    if (!graficoDemanda) return;
    
    graficoDemanda.data.labels = cidades.map(c => c.nome);
    graficoDemanda.data.datasets[0].data = cidades.map(c => c.demandaAtualM3);
    graficoDemanda.update('none');
}

function atualizarGraficoProducao(cidades) {
    if (!graficoProducao) return;
    
    graficoProducao.data.labels = cidades.map(c => c.nome);
    graficoProducao.data.datasets[0].data = cidades.map(c => c.producaoEfetivaM3);
    graficoProducao.data.datasets[1].data = cidades.map(c => c.demandaAtualM3);
    graficoProducao.update('none');
}

function atualizarGraficoFluxos(cidades) {
    if (!graficoFluxos) return;
    
    graficoFluxos.data.labels = cidades.map(c => c.nome);
    graficoFluxos.data.datasets[0].data = cidades.map(c => c.nivel_atual_reservatorio_m3);
    graficoFluxos.update('none');
}

function atualizarGraficoPrevisao(dadosHistorico, previsoes) {
    if (!graficoPrevisao) return;
    
    const labels = dadosHistorico.map((d, i) => `Dia ${i + 1}`);
    
    graficoPrevisao.data.labels = labels;
    graficoPrevisao.data.datasets[0].data = dadosHistorico;
    graficoPrevisao.data.datasets[1].data = previsoes;
    graficoPrevisao.update('none');
}

function destruirGraficos() {
    if (graficoDemanda) graficoDemanda.destroy();
    if (graficoProducao) graficoProducao.destroy();
    if (graficoFluxos) graficoFluxos.destroy();
    if (graficoPrevisao) graficoPrevisao.destroy();
}

export {
    inicializarGraficos,
    atualizarGraficos,
    atualizarGraficoDemanda,
    atualizarGraficoProducao,
    atualizarGraficoFluxos,
    atualizarGraficoPrevisao,
    destruirGraficos
};
