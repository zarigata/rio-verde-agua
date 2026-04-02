// Mapa de infraestrutura — Rio Verde (adaptado para cidade única)

let mapa = null;
let marcadores = [];
let itensAtual = [];

function corPorTipo(tipo) {
  switch (tipo) {
    case 'captacao':
    case 'captacao_natural': return 'blue';
    case 'tratamento': return 'green';
    case 'reservacao': return 'purple';
    case 'tratamento_esgoto': return 'orange';
    case 'distribuicao': return 'gray';
    default: return 'red';
  }
}

export function inicializarMapa(containerId) {
  if (typeof L === 'undefined') {
    console.warn('Leaflet não carregado. O mapa não poderá ser inicializado.')
    return;
  }
  mapa = L.map(containerId).setView([-17.7911, -50.9256], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(mapa);
  criarsLegenda();
}

function limparMarcadores() {
  marcadores.forEach(m => mapa && mapa.removeLayer(m));
  marcadores = [];
}

export function renderizarInfraestrutura(itens) {
  if (!mapa) return;
  itensAtual = itens;
  limparMarcadores();
  itens.forEach(it => {
    if (!it.latitude || !it.longitude) return;
    const cor = corPorTipo(it.tipo);
    const marker = L.marker([it.latitude, it.longitude], {
      // marcador simples com cor
      icon: L.divIcon({
        html: `<span style="width:12px;height:12px;border-radius:50%;background:${cor};display:inline-block;"></span>`,
        className: ''
      })
    });
    const popup = `<strong>${it.nome}</strong><br/>Tipo: ${it.tipo}<br/>Capacidade: ${it.capacidade_valor} ${it.capacidade_unidade}<br/>Certeza: ${it.certeza_nivel}<br/>Descrição: ${it.descricao || ''}`;
    marker.bindPopup(popup);
    marker.addTo(mapa);
    marcadores.push(marker);
  });
}

function criarsLegenda() {
  const legenda = L.control({ position: 'topright' });
  legenda.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legenda-certeza');
    div.innerHTML = '<strong>Legenda de Certeza</strong><br/><span style="background:#2f9e44;width:12px;height:12px;display:inline-block;border-radius:2px"></span> Confirmado<br/><span style="background:#f59e0b;width:12px;height:12px;display:inline-block;border-radius:2px"></span> Derivado<br/><span style="background:#e11d48;width:12px;height:12px;display:inline-block;border-radius:2px"></span> Aproximado';
    return div;
  };
  legenda.addTo(mapa);
}

export function centralizarEmItem(itemId) {
  const item = itensAtual.find(i => i.id === itemId);
  if (item && mapa) {
    mapa.flyTo([item.latitude, item.longitude], 14, { animate: true });
  }
}
