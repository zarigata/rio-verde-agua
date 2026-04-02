// Gráficos analíticos para Rio Verde

let chartProducaoDemanda = null;
let chartSimulacao = null;

export function inicializarGraficos() {
  // Bar chart: capacidades e demanda
  const ctxBar = document.getElementById('grafico-producao-demanda')?.getContext('2d');
  if (ctxBar) {
    chartProducaoDemanda = new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: ['ETA Abóbora (capacidade)', 'ETA Rio Verdinho (capacidade)', 'Demanda atual'],
        datasets: [{
          label: 'Valores (m³/d)',
          data: [10368, 69120, 36224],
          backgroundColor: ['#2e7d32', '#1976d2', '#f57c00']
        }]
      },
      options: {
        responsive: true,
        animation: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  const ctxLine = document.getElementById('grafico-simulacao')?.getContext('2d');
  if (ctxLine) {
    chartSimulacao = new Chart(ctxLine, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          { label: 'Produção (m³/d)', data: [], borderColor: '#2e7d32', fill: false },
          { label: 'Demanda (m³/d)', data: [], borderColor: '#f44336', fill: false },
          { label: 'Reservatório (m³)', data: [], borderColor: '#2196f3', fill: false }
        ]
      },
      options: {
        responsive: true,
        animation: false,
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
  const dia = (estado.tempoSimulacao ?? chartSimulacao.data.labels.length) + 1;
  chartSimulacao.data.labels.push(dia.toString());
  chartSimulacao.data.datasets[0].data.push(estado.producaoEfetiva);
  chartSimulacao.data.datasets[1].data.push(estado.demandaAtual);
  chartSimulacao.data.datasets[2].data.push(estado.nivelReservatorio);
  if (chartSimulacao.data.labels.length > 50) {
    chartSimulacao.data.labels.shift();
    chartSimulacao.data.datasets.forEach(ds => ds.data.shift());
  }
  chartSimulacao.update();
}

export function atualizarGraficoProducaoDemanda(estado) {
  if (!chartProducaoDemanda) return;
  chartProducaoDemanda.data.datasets[0].data = [estado.producaoBruta, estado.producaoEfetiva];
  chartProducaoDemanda.data.labels = ['Producao Bruta (ETA Abóbora)', 'Producao Efetiva (Rio Verde)'];
  chartProducaoDemanda.update();
}