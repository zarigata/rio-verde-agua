/**
 * simulador.js - Motor de simulação de eventos
 * Gerencia eventos, controle de tempo e estado do sistema
 */

import { calcularDemandaDiaria, calcularProducaoEfetiva, calcularBalancoHidrico, calcularEfeitoClimatico } from './hidrologia.js';

let estadoSistema = {
    cidades: {},
    conexoes: [],
    tempoSimulacao: {
        hora: 0,
        dia: 1,
        mes: 1,
        ano: 2024
    },
    eventoAtivo: null,
    historicoEventos: [],
    fluxosAtivos: []
};

let ouvintes = [];

function carregarDados(cidades, conexoes) {
    estadoSistema.cidades = {};
    cidades.forEach(cidade => {
        estadoSistema.cidades[cidade.id] = {
            ...cidade,
            demandaAtualM3: calcularDemandaDiaria(cidade.populacao, cidade.consumo_medio_litros_dia, cidade.fator_industrial),
            producaoEfetivaM3: calcularProducaoEfetiva(cidade.producao_diaria_m3),
            deficitM3: 0,
            excedenteM3: 0,
            status: 'normal',
            transferenciasRecebidas: 0,
            transferenciasEnviadas: 0
        };
    });
    estadoSistema.conexoes = conexoes;
    atualizarStatusCidades();
    notificarMudanca();
}

function inscrever(callback) {
    ouvintes.push(callback);
    return () => {
        ouvintes = ouvintes.filter(o => o !== callback);
    };
}

function notificarMudanca() {
    ouvintes.forEach(callback => callback(estadoSistema));
}

function obterEstado() {
    return estadoSistema;
}

function atualizarStatusCidades() {
    Object.keys(estadoSistema.cidades).forEach(id => {
        const cidade = estadoSistema.cidades[id];
        const balanco = calcularBalancoHidrico(
            cidade.producaoEfetivaM3,
            cidade.demandaAtualM3,
            cidade.nivel_atual_reservatorio_m3
        );
        
        cidade.deficitM3 = Math.max(0, balanco.deficit);
        cidade.excedenteM3 = balanco.excedente;
        cidade.status = balanco.status;
        cidade.percentualAtendimento = balanco.percentualAtendimento;
    });
}

function simularEvento(tipoEvento, cidadeId = null, parametros = {}) {
    const evento = {
        tipo: tipoEvento,
        cidadeId: cidadeId,
        parametros: parametros,
        timestamp: new Date().toISOString(),
        tempoSimulacao: { ...estadoSistema.tempoSimulacao }
    };
    
    switch (tipoEvento) {
        case 'seca':
            aplicarEventoSeca(cidadeId, parametros);
            break;
        case 'chuva_intensa':
            aplicarEventoChuva(cidadeId, parametros);
            break;
        case 'crescimento_populacional':
            aplicarCrescimentoPopulacional(cidadeId, parametros.taxa || 0.1);
            break;
        case 'aumento_industrial':
            aplicarAumentoIndustrial(cidadeId, parametros.fator || 0.15);
            break;
        case 'quebra_reservatorio':
            aplicarQuebraReservatorio(cidadeId, parametros.percentualPerda || 0.5);
            break;
        case 'cidade_sem_agua':
            aplicarCidadeSemAgua(cidadeId);
            break;
        default:
            console.warn(`Evento desconhecido: ${tipoEvento}`);
            return false;
    }
    
    estadoSistema.historicoEventos.push(evento);
    estadoSistema.eventoAtivo = evento;
    atualizarStatusCidades();
    notificarMudanca();
    
    return true;
}

function aplicarEventoSeca(cidadeId, parametros) {
    const fatorReducao = parametros.intensidade || 0.4;
    
    if (cidadeId) {
        const cidade = estadoSistema.cidades[cidadeId];
        if (cidade) {
            cidade.producaoEfetivaM3 = Math.round(cidade.producaoEfetivaM3 * fatorReducao);
        }
    } else {
        Object.values(estadoSistema.cidades).forEach(cidade => {
            cidade.producaoEfetivaM3 = Math.round(cidade.producaoEfetivaM3 * fatorReducao);
        });
    }
}

function aplicarEventoChuva(cidadeId, parametros) {
    const fatorAumento = parametros.intensidade || 1.4;
    const enchente = parametros.enchente || false;
    
    if (cidadeId) {
        const cidade = estadoSistema.cidades[cidadeId];
        if (cidade) {
            cidade.producaoEfetivaM3 = Math.round(cidade.producaoEfetivaM3 * fatorAumento);
            cidade.nivel_atual_reservatorio_m3 = Math.min(
                cidade.capacidade_reservatorio_m3,
                cidade.nivel_atual_reservatorio_m3 * 1.2
            );
            if (enchente) {
                cidade.producaoEfetivaM3 = Math.round(cidade.producaoEfetivaM3 * 0.8);
            }
        }
    } else {
        Object.values(estadoSistema.cidades).forEach(cidade => {
            cidade.producaoEfetivaM3 = Math.round(cidade.producaoEfetivaM3 * fatorAumento);
            cidade.nivel_atual_reservatorio_m3 = Math.min(
                cidade.capacidade_reservatorio_m3,
                cidade.nivel_atual_reservatorio_m3 * 1.2
            );
        });
    }
}

function aplicarCrescimentoPopulacional(cidadeId, taxa) {
    if (cidadeId) {
        const cidade = estadoSistema.cidades[cidadeId];
        if (cidade) {
            cidade.populacao = Math.round(cidade.populacao * (1 + taxa));
            cidade.demandaAtualM3 = calcularDemandaDiaria(
                cidade.populacao,
                cidade.consumo_medio_litros_dia,
                cidade.fator_industrial
            );
        }
    } else {
        Object.values(estadoSistema.cidades).forEach(cidade => {
            cidade.populacao = Math.round(cidade.populacao * (1 + taxa));
            cidade.demandaAtualM3 = calcularDemandaDiaria(
                cidade.populacao,
                cidade.consumo_medio_litros_dia,
                cidade.fator_industrial
            );
        });
    }
}

function aplicarAumentoIndustrial(cidadeId, fator) {
    if (cidadeId) {
        const cidade = estadoSistema.cidades[cidadeId];
        if (cidade) {
            cidade.fator_industrial = cidade.fator_industrial * (1 + fator);
            cidade.demandaAtualM3 = calcularDemandaDiaria(
                cidade.populacao,
                cidade.consumo_medio_litros_dia,
                cidade.fator_industrial
            );
        }
    } else {
        Object.values(estadoSistema.cidades).forEach(cidade => {
            cidade.fator_industrial = cidade.fator_industrial * (1 + fator);
            cidade.demandaAtualM3 = calcularDemandaDiaria(
                cidade.populacao,
                cidade.consumo_medio_litros_dia,
                cidade.fator_industrial
            );
        });
    }
}

function aplicarQuebraReservatorio(cidadeId, percentualPerda) {
    if (!cidadeId) return;
    
    const cidade = estadoSistema.cidades[cidadeId];
    if (cidade) {
        cidade.nivel_atual_reservatorio_m3 = Math.round(
            cidade.nivel_atual_reservatorio_m3 * (1 - percentualPerda)
        );
        cidade.capacidade_reservatorio_m3 = Math.round(
            cidade.capacidade_reservatorio_m3 * (1 - percentualPerda * 0.5)
        );
    }
}

function aplicarCidadeSemAgua(cidadeId) {
    if (!cidadeId) return;
    
    const cidade = estadoSistema.cidades[cidadeId];
    if (cidade) {
        cidade.nivel_atual_reservatorio_m3 = 0;
        cidade.producaoEfetivaM3 = 0;
        cidade.status = 'critico';
    }
}

function avancarTempo(unidade, quantidade = 1) {
    switch (unidade) {
        case 'hora':
            estadoSistema.tempoSimulacao.hora += quantidade;
            while (estadoSistema.tempoSimulacao.hora >= 24) {
                estadoSistema.tempoSimulacao.hora -= 24;
                avancarTempo('dia', 1);
            }
            break;
        case 'dia':
            estadoSistema.tempoSimulacao.dia += quantidade;
            while (estadoSistema.tempoSimulacao.dia > 30) {
                estadoSistema.tempoSimulacao.dia -= 30;
                avancarTempo('mes', 1);
            }
            simularConsumoDiario();
            break;
        case 'mes':
            estadoSistema.tempoSimulacao.mes += quantidade;
            while (estadoSistema.tempoSimulacao.mes > 12) {
                estadoSistema.tempoSimulacao.mes -= 12;
                avancarTempo('ano', 1);
            }
            break;
        case 'ano':
            estadoSistema.tempoSimulacao.ano += quantidade;
            break;
    }
    
    notificarMudanca();
}

function simularConsumoDiario() {
    Object.values(estadoSistema.cidades).forEach(cidade => {
        const consumo = cidade.demandaAtualM3;
        const producao = cidade.producaoEfetivaM3;
        const balanco = producao - consumo;
        
        cidade.nivel_atual_reservatorio_m3 = Math.max(0, Math.min(
            cidade.capacidade_reservatorio_m3,
            cidade.nivel_atual_reservatorio_m3 + balanco
        ));
    });
}

function reiniciarSimulacao() {
    estadoSistema.historicoEventos = [];
    estadoSistema.eventoAtivo = null;
    estadoSistema.fluxosAtivos = [];
    estadoSistema.tempoSimulacao = {
        hora: 0,
        dia: 1,
        mes: 1,
        ano: 2024
    };
}

function obterCidadePorId(id) {
    return estadoSistema.cidades[id] || null;
}

function obterTodasCidades() {
    return Object.values(estadoSistema.cidades);
}

function obterConexoes() {
    return estadoSistema.conexoes;
}

function definirNivelReservatorio(cidadeId, novoNivel) {
    const cidade = estadoSistema.cidades[cidadeId];
    if (cidade) {
        cidade.nivel_atual_reservatorio_m3 = Math.max(0, Math.min(
            cidade.capacidade_reservatorio_m3,
            novoNivel
        ));
        atualizarStatusCidades();
        notificarMudanca();
        return true;
    }
    return false;
}

export {
    carregarDados,
    inscrever,
    obterEstado,
    simularEvento,
    avancarTempo,
    reiniciarSimulacao,
    obterCidadePorId,
    obterTodasCidades,
    obterConexoes,
    definirNivelReservatorio,
    atualizarStatusCidades,
    notificarMudanca
};
