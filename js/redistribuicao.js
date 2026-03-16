/**
 * redistribuicao.js - Algoritmo de redistribuição automática de água
 * Balanceia recursos hídricos entre cidades conectadas
 */

import { calcularCapacidadeTransferencia } from './hidrologia.js';
import { obterEstado, atualizarStatusCidades, notificarMudanca } from './simulador.js';

function calcularFluxosRedistribuicao() {
    const estado = obterEstado();
    const cidades = estado.cidades;
    const conexoes = estado.conexoes;
    const fluxos = [];
    
    const cidadesComDeficit = Object.values(cidades)
        .filter(c => c.deficitM3 > 0)
        .sort((a, b) => b.deficitM3 - a.deficitM3);
    
    const cidadesComExcedente = Object.values(cidades)
        .filter(c => c.excedenteM3 > 0)
        .sort((a, b) => b.excedenteM3 - a.excedenteM3);
    
    cidadesComDeficit.forEach(cidadeDeficit => {
        let deficitRestante = cidadeDeficit.deficitM3;
        
        const conexoesCidade = conexoes.filter(
            c => c.origem === cidadeDeficit.id || c.destino === cidadeDeficit.id
        );
        
        for (const conexao of conexoesCidade) {
            if (deficitRestante <= 0) break;
            
            const cidadeOrigemId = conexao.origem === cidadeDeficit.id ? conexao.destino : conexao.origem;
            const cidadeOrigem = cidades[cidadeOrigemId];
            
            if (!cidadeOrigem || cidadeOrigem.excedenteM3 <= 0) continue;
            
            const capacidadeTransferencia = calcularCapacidadeTransferencia(
                conexao.distancia_km,
                conexao.capacidade_transferencia_m3_dia,
                cidadeOrigem.excedenteM3
            );
            
            const quantidadeTransferir = Math.min(
                deficitRestante,
                capacidadeTransferencia,
                cidadeOrigem.excedenteM3
            );
            
            if (quantidadeTransferir > 0) {
                fluxos.push({
                    origem: cidadeOrigemId,
                    destino: cidadeDeficit.id,
                    quantidadeM3: Math.round(quantidadeTransferir),
                    distanciaKm: conexao.distancia_km,
                    tipo: 'emergencia'
                });
                
                cidadeOrigem.excedenteM3 -= quantidadeTransferir;
                cidadeOrigem.nivel_atual_reservatorio_m3 -= quantidadeTransferir;
                cidadeOrigem.transferenciasEnviadas += quantidadeTransferir;
                
                deficitRestante -= quantidadeTransferir;
                cidadeDeficit.nivel_atual_reservatorio_m3 += quantidadeTransferir;
                cidadeDeficit.transferenciasRecebidas += quantidadeTransferir;
            }
        }
    });
    
    return fluxos;
}

function executarRedistribuicao() {
    const fluxos = calcularFluxosRedistribuicao();
    
    fluxos.forEach(fluxo => {
        console.log(`Transferência: ${fluxo.origem} -> ${fluxo.destino}: ${fluxo.quantidadeM3} m³`);
    });
    
    atualizarStatusCidades();
    notificarMudanca();
    
    return {
        fluxosRealizados: fluxos.length,
        volumeTotalTransferido: fluxos.reduce((sum, f) => sum + f.quantidadeM3, 0),
        fluxos: fluxos
    };
}

function verificarNecessidadeRedistribuicao() {
    const estado = obterEstado();
    const cidadesCriticas = Object.values(estado.cidades)
        .filter(c => c.status === 'critico' || c.deficitM3 > 0);
    
    return {
        necessitaRedistribuicao: cidadesCriticas.length > 0,
        cidadesCriticas: cidadesCriticas.map(c => ({
            id: c.id,
            nome: c.nome,
            deficit: c.deficitM3,
            status: c.status
        }))
    };
}

function calcularMatrizDistancias() {
    const estado = obterEstado();
    const cidadesIds = Object.keys(estado.cidades);
    const matriz = {};
    
    cidadesIds.forEach(id1 => {
        matriz[id1] = {};
        cidadesIds.forEach(id2 => {
            if (id1 === id2) {
                matriz[id1][id2] = 0;
            } else {
                const conexao = estado.conexoes.find(
                    c => (c.origem === id1 && c.destino === id2) || 
                         (c.origem === id2 && c.destino === id1)
                );
                matriz[id1][id2] = conexao ? conexao.distancia_km : Infinity;
            }
        });
    });
    
    return matriz;
}

function encontrarCaminhoMaisCurto(origemId, destinoId) {
    const matriz = calcularMatrizDistancias();
    const cidadesIds = Object.keys(matriz);
    
    const distancias = {};
    const anteriores = {};
    const naoVisitados = new Set(cidadesIds);
    
    cidadesIds.forEach(id => {
        distancias[id] = Infinity;
    });
    distancias[origemId] = 0;
    
    while (naoVisitados.size > 0) {
        let atual = null;
        let menorDistancia = Infinity;
        
        naoVisitados.forEach(id => {
            if (distancias[id] < menorDistancia) {
                menorDistancia = distancias[id];
                atual = id;
            }
        });
        
        if (atual === null || atual === destinoId) break;
        
        naoVisitados.delete(atual);
        
        naoVisitados.forEach(vizinho => {
            const distancia = distancias[atual] + matriz[atual][vizinho];
            if (distancia < distancias[vizinho]) {
                distancias[vizinho] = distancia;
                anteriores[vizinho] = atual;
            }
        });
    }
    
    const caminho = [];
    let atual = destinoId;
    while (atual) {
        caminho.unshift(atual);
        atual = anteriores[atual];
    }
    
    return {
        distancia: distancias[destinoId],
        caminho: caminho
    };
}

function simularCenarioRedistribuicao(cidadeSemAguaId) {
    const estadoOriginal = JSON.parse(JSON.stringify(obterEstado()));
    
    const cidade = estadoOriginal.cidades[cidadeSemAguaId];
    if (!cidade) return null;
    
    cidade.nivel_atual_reservatorio_m3 = 0;
    cidade.producaoEfetivaM3 = 0;
    
    const resultado = calcularFluxosRedistribuicao();
    
    return {
        cidadeAfetada: cidadeSemAguaId,
        fluxosNecessarios: resultado,
        volumeRecebido: resultado.reduce((sum, f) => f.destino === cidadeSemAguaId ? sum + f.quantidadeM3 : sum, 0)
    };
}

export {
    calcularFluxosRedistribuicao,
    executarRedistribuicao,
    verificarNecessidadeRedistribuicao,
    calcularMatrizDistancias,
    encontrarCaminhoMaisCurto,
    simularCenarioRedistribuicao
};
