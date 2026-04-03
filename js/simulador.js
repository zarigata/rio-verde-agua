import { calcularDemandaDiaria, calcularProducaoEfetiva } from './hidrologia.js';

var estado = null;
var inscritores = [];
var logSessao = [];
var pontosAtuais = [];
var pontosOriginais = [];

function criarEstadoInicial() {
  var populacao = 241494;
  var capacidadeEtaAbobora = 10368;
  var demandaDiariaInicial = calcularDemandaDiaria(populacao, 150, 1.0);
  var producaoEfetivaInicial = calcularProducaoEfetiva(capacidadeEtaAbobora, 25);
  var capacidadeReservatorio = 2000;
  var nivelReservatorio = capacidadeReservatorio * 0.5;
  return {
    municipio: 'Rio Verde',
    populacao: populacao,
    producaoBruta: capacidadeEtaAbobora,
    demandaAtual: demandaDiariaInicial,
    producaoEfetiva: producaoEfetivaInicial,
    capacidadeReservatorio: capacidadeReservatorio,
    nivelReservatorio: nivelReservatorio,
    tempoSimulacao: 0,
    historicoEventos: [],
    eventoAtivo: null,
    fatorIndustrial: 1.0
  };
}

function notificar(estadoAtual) {
  for (var i = 0; i < inscritores.length; i++) {
    try { inscritores[i](estadoAtual); } catch (e) { /* ignore */ }
  }
}

function inicializarSimulacao(pontos) {
  if (pontos && pontos.length > 0) {
    pontosOriginais = pontos.map(function(p) { return Object.assign({}, p); });
    pontosAtuais = pontos.map(function(p) { return Object.assign({}, p); });
  }
  estado = criarEstadoInicial();
  logSessao = [];
  notificar(estado);
}

function inscrever(callback) {
  if (typeof callback === 'function') {
    inscritores.push(callback);
  }
}

function obterEstado() {
  return estado;
}

function obterEstadoPontos() {
  return pontosAtuais;
}

function obterPontosOriginais() {
  return pontosOriginais;
}

function obterUltimaTransferencia() {
  return null;
}

function obterLog() {
  return logSessao;
}

function simularEvento(evento) {
  if (!estado) return;
  switch (evento) {
    case 'seca':
      estado.producaoBruta = Math.max(0, estado.producaoBruta * 0.6);
      estado.producaoEfetiva = calcularProducaoEfetiva(estado.producaoBruta, 25);
      estado.historicoEventos.push({ dia: estado.tempoSimulacao, evento });
      break;
    case 'chuva_intensa':
      estado.producaoBruta = estado.producaoBruta * 1.4;
      estado.producaoEfetiva = calcularProducaoEfetiva(estado.producaoBruta, 25);
      estado.historicoEventos.push({ dia: estado.tempoSimulacao, evento });
      break;
    case 'crescimento_populacional':
      estado.populacao = Math.round(estado.populacao * 1.02);
      estado.demandaAtual = calcularDemandaDiaria(estado.populacao, 150, estado.fatorIndustrial);
      estado.historicoEventos.push({ dia: estado.tempoSimulacao, evento, populacao: estado.populacao });
      break;
    case 'aumento_industrial':
      estado.fatorIndustrial *= 1.15;
      estado.demandaAtual = calcularDemandaDiaria(estado.populacao, 150, estado.fatorIndustrial);
      estado.historicoEventos.push({ dia: estado.tempoSimulacao, evento });
      break;
    case 'quebra_reservatorio':
      estado.nivelReservatorio = Math.max(0, estado.nivelReservatorio * 0.9);
      estado.historicoEventos.push({ dia: estado.tempoSimulacao, evento });
      break;
    default:
      break;
  }
  estado.demandaAtual = Math.max(0, estado.demandaAtual);
  estado.producaoEfetiva = calcularProducaoEfetiva(estado.producaoBruta, 25);
  notificar(estado);
}

function avancarTempo(dias) {
  if (!estado) return;
  dias = dias || 1;
  estado.tempoSimulacao += dias;
  var saldo = estado.producaoEfetiva - estado.demandaAtual;
  estado.nivelReservatorio = Math.max(0, Math.min(estado.capacidadeReservatorio, estado.nivelReservatorio + saldo));
  notificar(estado);
}

function reiniciarSimulacao() {
  inicializarSimulacao(pontosOriginais.length > 0 ? pontosOriginais : null);
}

function simularTransferencia(origemId, destinoId, volumeSolicitado, perdaPercentual) {
  if (!pontosAtuais || origemId === destinoId) return null;

  var origem = null;
  var destino = null;
  for (var i = 0; i < pontosAtuais.length; i++) {
    if (pontosAtuais[i].id === origemId) origem = pontosAtuais[i];
    if (pontosAtuais[i].id === destinoId) destino = pontosAtuais[i];
  }
  if (!origem || !destino) return null;

  var perda = (perdaPercentual || 0) / 100;
  var volumeDisponivel = Math.max(0, origem.volume_atual_m3 - origem.reserva_minima_m3);
  var espacoDestino = destino.capacidade_maxima_m3 - destino.volume_atual_m3;
  var volumeEfetivo = Math.min(volumeSolicitado || 0, volumeDisponivel, espacoDestino);
  volumeEfetivo = Math.max(0, volumeEfetivo);

  var volumeAntesOrigem = origem.volume_atual_m3;
  var volumeAntesDestino = destino.volume_atual_m3;
  var autonomiaAntesOrigem = origem.consumo_medio_m3_dia > 0 ? origem.volume_atual_m3 / origem.consumo_medio_m3_dia : Infinity;
  var autonomiaAntesDestino = destino.consumo_medio_m3_dia > 0 ? destino.volume_atual_m3 / destino.consumo_medio_m3_dia : Infinity;

  origem.volume_atual_m3 -= volumeEfetivo;
  var volumeRecebido = volumeEfetivo * (1 - perda);
  destino.volume_atual_m3 = Math.min(destino.capacidade_maxima_m3, destino.volume_atual_m3 + volumeRecebido);

  var autonomiaDepoisOrigem = origem.consumo_medio_m3_dia > 0 ? origem.volume_atual_m3 / origem.consumo_medio_m3_dia : Infinity;
  var autonomiaDepoisDestino = destino.consumo_medio_m3_dia > 0 ? destino.volume_atual_m3 / destino.consumo_medio_m3_dia : Infinity;

  var resultado = {
    origem: {
      id: origem.id, nome: origem.nome,
      volumeAntes: volumeAntesOrigem, volumeDepois: origem.volume_atual_m3,
      autonomiaAntes: autonomiaAntesOrigem, autonomiaDepois: autonomiaDepoisOrigem,
      reservaMinima: origem.reserva_minima_m3,
      abaixoReserva: origem.volume_atual_m3 < origem.reserva_minima_m3
    },
    destino: {
      id: destino.id, nome: destino.nome,
      volumeAntes: volumeAntesDestino, volumeDepois: destino.volume_atual_m3,
      autonomiaAntes: autonomiaAntesDestino, autonomiaDepois: autonomiaDepoisDestino,
      reservaMinima: destino.reserva_minima_m3,
      abaixoReserva: destino.volume_atual_m3 < destino.reserva_minima_m3
    },
    volumeTransferido: volumeEfetivo,
    volumeRecebido: volumeRecebido,
    perdaPercentual: perdaPercentual,
    perdaVolume: volumeEfetivo - volumeRecebido,
    viavel: volumeEfetivo > 0,
    timestamp: new Date().toLocaleTimeString('pt-BR')
  };

  logSessao.push({
    hora: resultado.timestamp,
    origem: origem.nome,
    destino: destino.nome,
    volume: volumeEfetivo,
    viavel: resultado.viavel
  });

  return resultado;
}

export {
  inicializarSimulacao, inscrever, obterEstado, obterEstadoPontos,
  obterPontosOriginais, obterUltimaTransferencia, obterLog,
  simularEvento, avancarTempo, reiniciarSimulacao, simularTransferencia
};

window.inicializarSimulacao = inicializarSimulacao;
window.inscrever = inscrever;
window.obterEstado = obterEstado;
window.obterEstadoPontos = obterEstadoPontos;
window.obterPontosOriginais = obterPontosOriginais;
window.obterUltimaTransferencia = obterUltimaTransferencia;
window.obterLog = obterLog;
window.simularEvento = simularEvento;
window.avancarTempo = avancarTempo;
window.reiniciarSimulacao = reiniciarSimulacao;
window.simularTransferencia = simularTransferencia;
