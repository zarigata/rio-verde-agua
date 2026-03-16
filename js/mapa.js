import { obterTodasCidades, obterConexoes, inscrever } from './simulador.js';

let mapa = null;
let camadasCidades = {};
let camadasFluxos = [];
let cidadeSelecionada = null;
let aoClicarCidadeCallback = null;

function inicializarMapa(containerId) {
    mapa = L.map(containerId).setView([-17.7911, -50.9256], 9);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap | Plataforma de Gestão Hídrica',
        maxZoom: 18
    }).addTo(mapa);
    
    return mapa;
}

function obterCorStatus(status) {
    switch (status) {
        case 'normal': return '#28a745';
        case 'pressao': return '#ffc107';
        case 'critico': return '#dc3545';
        default: return '#6c757d';
    }
}

function criarMarcadorCidade(cidade) {
    const cor = obterCorStatus(cidade.status);
    const percentual = Math.round((cidade.nivel_atual_reservatorio_m3 / cidade.capacidade_reservatorio_m3) * 100);
    
    const iconeHtml = `
        <div class="marcador-cidade" style="
            background-color: ${cor};
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 11px;
            cursor: pointer;
        ">${percentual}%</div>
    `;
    
    const icone = L.divIcon({
        html: iconeHtml,
        className: 'icone-cidade-personalizado',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
    
    const marcador = L.marker([cidade.coordenadas.lat, cidade.coordenadas.lng], {
        icon: icone,
        cidadeId: cidade.id
    });
    
    marcador.on('click', () => {
        aoClicarCidade(cidade);
    });
    
    const popupConteudo = criarPopupCidade(cidade);
    marcador.bindPopup(popupConteudo, { maxWidth: 300 });
    
    return marcador;
}

function criarPopupCidade(cidade) {
    const corStatus = obterCorStatus(cidade.status);
    const statusTexto = cidade.status === 'normal' ? 'Normal' : 
                        cidade.status === 'pressao' ? 'Pressão' : 'Crítico';
    
    return `
        <div class="popup-cidade">
            <h3 style="margin: 0 0 10px 0; color: ${corStatus};">${cidade.nome}</h3>
            <p style="margin: 5px 0;"><strong>População:</strong> ${cidade.populacao.toLocaleString('pt-BR')} hab</p>
            <p style="margin: 5px 0;"><strong>Demanda:</strong> ${cidade.demandaAtualM3.toLocaleString('pt-BR')} m³/dia</p>
            <p style="margin: 5px 0;"><strong>Produção:</strong> ${cidade.producaoEfetivaM3.toLocaleString('pt-BR')} m³/dia</p>
            <p style="margin: 5px 0;"><strong>Reservatório:</strong> ${cidade.nivel_atual_reservatorio_m3.toLocaleString('pt-BR')} / ${cidade.capacidade_reservatorio_m3.toLocaleString('pt-BR')} m³</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${corStatus}; font-weight: bold;">${statusTexto}</span></p>
            ${cidade.deficitM3 > 0 ? `<p style="margin: 5px 0; color: #dc3545;"><strong>Déficit:</strong> ${cidade.deficitM3.toLocaleString('pt-BR')} m³</p>` : ''}
            ${cidade.excedenteM3 > 0 ? `<p style="margin: 5px 0; color: #28a745;"><strong>Excedente:</strong> ${cidade.excedenteM3.toLocaleString('pt-BR')} m³</p>` : ''}
        </div>
    `;
}

function renderizarCidades(cidades) {
    Object.keys(camadasCidades).forEach(id => {
        mapa.removeLayer(camadasCidades[id]);
    });
    camadasCidades = {};
    
    cidades.forEach(cidade => {
        const marcador = criarMarcadorCidade(cidade);
        marcador.addTo(mapa);
        camadasCidades[cidade.id] = marcador;
    });
}

function renderizarFluxos(fluxos, cidades) {
    limparFluxos();
    
    fluxos.forEach(fluxo => {
        const cidadeOrigem = cidades.find(c => c.id === fluxo.origem);
        const cidadeDestino = cidades.find(c => c.id === fluxo.destino);
        
        if (!cidadeOrigem || !cidadeDestino) return;
        
        const corLinha = fluxo.tipo === 'emergencia' ? '#dc3545' : '#007bff';
        const opacidade = Math.min(1, fluxo.quantidadeM3 / 5000);
        
        const linha = L.polyline(
            [
                [cidadeOrigem.coordenadas.lat, cidadeOrigem.coordenadas.lng],
                [cidadeDestino.coordenadas.lat, cidadeDestino.coordenadas.lng]
            ],
            {
                color: corLinha,
                weight: 3 + (fluxo.quantidadeM3 / 1000),
                opacity: opacidade,
                dashArray: '10, 5'
            }
        ).addTo(mapa);
        
        linha.bindPopup(`
            <div class="popup-fluxo">
                <h4>Transferência de Água</h4>
                <p><strong>De:</strong> ${cidadeOrigem.nome}</p>
                <p><strong>Para:</strong> ${cidadeDestino.nome}</p>
                <p><strong>Quantidade:</strong> ${fluxo.quantidadeM3.toLocaleString('pt-BR')} m³</p>
                <p><strong>Distância:</strong> ${fluxo.distanciaKm} km</p>
            </div>
        `);
        
        const pontoMedio = [
            (cidadeOrigem.coordenadas.lat + cidadeDestino.coordenadas.lat) / 2,
            (cidadeOrigem.coordenadas.lng + cidadeDestino.coordenadas.lng) / 2
        ];
        
        const seta = L.marker(pontoMedio, {
            icon: L.divIcon({
                html: `<div style="color: ${corLinha}; font-size: 16px;">→</div>`,
                className: 'seta-fluxo',
                iconSize: [20, 20]
            })
        }).addTo(mapa);
        
        camadasFluxos.push(linha);
        camadasFluxos.push(seta);
    });
}

function limparFluxos() {
    camadasFluxos.forEach(camada => {
        mapa.removeLayer(camada);
    });
    camadasFluxos = [];
}

function atualizarVisualizacao(estado) {
    const cidades = Object.values(estado.cidades);
    renderizarCidades(cidades);
    
    if (estado.fluxosAtivos && estado.fluxosAtivos.length > 0) {
        renderizarFluxos(estado.fluxosAtivos, cidades);
    }
}

function centralizarEmCidade(cidadeId) {
    const cidades = obterTodasCidades();
    const cidade = cidades.find(c => c.id === cidadeId);
    
    if (cidade && mapa) {
        mapa.setView([cidade.coordenadas.lat, cidade.coordenadas.lng], 12);
        
        if (camadasCidades[cidadeId]) {
            camadasCidades[cidadeId].openPopup();
        }
    }
}

function definirCallbackClique(callback) {
    aoClicarCidadeCallback = callback;
}

function aoClicarCidade(cidade) {
    cidadeSelecionada = cidade;
    
    if (aoClicarCidadeCallback) {
        aoClicarCidadeCallback(cidade);
    }
}

function obterCidadeSelecionada() {
    return cidadeSelecionada;
}

function obterMapa() {
    return mapa;
}

export {
    inicializarMapa,
    renderizarCidades,
    renderizarFluxos,
    limparFluxos,
    atualizarVisualizacao,
    centralizarEmCidade,
    definirCallbackClique,
    obterCidadeSelecionada,
    obterMapa,
    obterCorStatus
};
