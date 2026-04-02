import { calcularDemandaDiaria, calcularProducaoEfetiva } from './hidrologia.js';

// Simulador para cidade única (Rio Verde)

let estado = null;
let inscritores = [];

function criarEstadoInicial() {
  // Valores iniciais conforme contexto do enunciado
  const populacao = 241494;
  const capacidadeEtaAbobora = 10368; // m³/d
  const demandaDiariaInicial = calcularDemandaDiaria(populacao, 150, 1.0); // 36.224 m³/d approx
  const producaoEfetivaInicial = calcularProducaoEfetiva(capacidadeEtaAbobora, 25);
  const capacidadeReservatorio = 2000;
  const nivelReservatorio = capacidadeReservatorio * 0.5; // 50%

  return {
    municipio: 'Rio Verde',
    populacao,
    producaoBruta: capacidadeEtaAbobora,
    demandaAtual: demandaDiariaInicial,
    producaoEfetiva: producaoEfetivaInicial,
    capacidadeReservatorio,
    nivelReservatorio,
    tempoSimulacao: 0,
    historicoEventos: [],
    eventoAtivo: null,
    fatorIndustrial: 1.0
  };
}

function notificar(estadoAtual) {
  for (const cb of inscritores) {
    try { cb(estadoAtual); } catch (e) { /* ignore */ }
  }
}

export function inicializarSimulacao() {
  estado = criarEstadoInicial();
  notificar(estado);
}

export function inscrever(callback) {
  if (typeof callback === 'function') {
    inscritores.push(callback);
  }
}

export function obterEstado() {
  return estado;
}

export function simularEvento(evento) {
  if (!estado) return;
  switch (evento) {
    case 'seca': {
      estado.producaoBruta = Math.max(0, estado.producaoBruta * 0.6);
      estado.producaoEfetiva = calcularProducaoEfetiva(estado.producaoBruta, 25);
      estado.historicoEventos.push({ dia: estado.tempoSimulacao, evento });
      break;
    }
    case 'chuva_intensa': {
      estado.producaoBruta = estado.producaoBruta * 1.4;
      estado.producaoEfetiva = calcularProducaoEfetiva(estado.producaoBruta, 25);
      estado.historicoEventos.push({ dia: estado.tempoSimulacao, evento });
      break;
    }
    case 'crescimento_populacional': {
      estado.populacao = Math.round(estado.populacao * 1.02);
      estado.demandaAtual = calcularDemandaDiaria(estado.populacao, 150, estado.fatorIndustrial);
      estado.historicoEventos.push({ dia: estado.tempoSimulacao, evento, populacao: estado.populacao });
      break;
    }
    case 'aumento_industrial': {
      estado.fatorIndustrial *= 1.15;
      estado.demandaAtual = calcularDemandaDiaria(estado.populacao, 150, estado.fatorIndustrial);
      estado.historicoEventos.push({ dia: estado.tempoSimulacao, evento });
      break;
    }
    case 'quebra_reservatorio': {
      estado.nivelReservatorio = Math.max(0, estado.nivelReservatorio * 0.9);
      estado.historicoEventos.push({ dia: estado.tempoSimulacao, evento });
      break;
    }
    default:
      // evento desconhecido não altera estado
      break;
  }

  // Recalcular dependentes após evento
  estado.demandaAtual = Math.max(0, estado.demandaAtual);
  estado.producaoEfetiva = calcularProducaoEfetiva(estado.producaoBruta, 25);
  notificar(estado);
}

export function avancarTempo(dias = 1) {
  if (!estado) return;
  estado.tempoSimulacao += dias;
  const saldo = estado.producaoEfetiva - estado.demandaAtual;
  estado.nivelReservatorio = Math.max(0, Math.min(estado.capacidadeReservatorio, estado.nivelReservatorio + saldo));
  notificar(estado);
}

export function reiniciarSimulacao() {
  inicializarSimulacao();
}