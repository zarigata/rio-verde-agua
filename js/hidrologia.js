export var CONSTANTES = {
    diasReserva: 7,
    consumoBaseLitrosDia: 150,
    fatorIndustrial: 1.0
};

export function calcularDemandaDiaria(populacao, consumoLitrosDia, fatorIndustrial) {
    var fator = fatorIndustrial != null ? fatorIndustrial : 1.0;
    return (populacao * consumoLitrosDia * fator) / 1000;
}

export function calcularDemandaMensal(demandaDiaria, dias) {
    return demandaDiaria * (dias || 30);
}

export function calcularProducaoEfetiva(producaoBruta, perdaPercentual) {
    var perda = (perdaPercentual || 0) / 100;
    return producaoBruta * (1 - perda);
}

export function calcularBalancoHidrico(producao, demanda, nivelReservatorio) {
    var fatorNivel = Math.max(0, Math.min(1, (nivelReservatorio || 0) / 100));
    return (producao - demanda) * fatorNivel;
}

export function calcularIndiceEstresseHidrico(demanda, disponibilidade) {
    return demanda / Math.max(1, disponibilidade || 1);
}

export function calcularConsumoSazonal(consumoBase, mes) {
    var fatores = [1.02, 1.01, 0.98, 0.95, 1.00, 1.05, 1.00, 0.95, 0.97, 1.04, 1.03, 1.01];
    return consumoBase * fatores[((mes - 1) % 12 + 12) % 12];
}

export function calcularEfeitoClimatico(tipoEvento, producaoBase) {
    if (!tipoEvento) return producaoBase;
    if (tipoEvento === 'seca') return producaoBase * 0.6;
    if (tipoEvento === 'chuva_intensa') return producaoBase * 1.4;
    return producaoBase;
}

export function calcularReservaMinima(demandaDiaria, diasReserva) {
    return demandaDiaria * (diasReserva || 1);
}

export function calcularOcupacaoPercentual(volume, capacidade) {
    if (!capacidade || capacidade <= 0) return 0;
    return Math.min(100, Math.max(0, (volume / capacidade) * 100));
}

export function calcularAutonomiaDias(volume, consumoMedio) {
    if (!consumoMedio || consumoMedio <= 0) return Infinity;
    return volume / consumoMedio;
}

export function classificarCriticidade(ocupacaoPercentual) {
    if (ocupacaoPercentual > 70) return 'normal';
    if (ocupacaoPercentual > 40) return 'atencao';
    if (ocupacaoPercentual > 20) return 'risco';
    return 'critico';
}

export function calcularScoreCenario(resultado) {
    if (!resultado) return 0;
    var score = 50;

    if (resultado.origem.abaixoReserva) score -= 30;
    if (resultado.destino.abaixoReserva) score -= 20;

    if (resultado.perdaPercentual > 20) score -= 10;
    if (resultado.perdaPercentual > 30) score -= 10;

    if (resultado.destino.autonomiaDepois > resultado.destino.autonomiaAntes) score += 15;
    if (resultado.origem.autonomiaDepois > 3) score += 10;
    if (!resultado.origem.abaixoReserva && !resultado.destino.abaixoReserva) score += 15;

    if (resultado.volumeTransferido <= 0) score -= 40;

    return Math.max(0, Math.min(100, score));
}

export function calcularVolumeIdeal(origem, destino, perdaPercentual) {
    if (!origem || !destino) return 0;
    var volumeDisponivel = Math.max(0, origem.volume_atual_m3 - origem.reserva_minima_m3);
    var espacoDestino = destino.capacidade_maxima_m3 - destino.volume_atual_m3;
    var perda = (perdaPercentual || 0) / 100;
    var volumeIdeal = Math.min(volumeDisponivel, espacoDestino / (1 - perda));

    if (destino.consumo_medio_m3_dia > 0) {
        var necessarioPara7dias = destino.consumo_medio_m3_dia * 7;
        var deficit = Math.max(0, necessarioPara7dias - destino.volume_atual_m3);
        volumeIdeal = Math.min(volumeIdeal, deficit / (1 - perda));
    }

    return Math.max(0, Math.round(volumeIdeal));
}

window.calcularDemandaDiaria = calcularDemandaDiaria;
window.calcularProducaoEfetiva = calcularProducaoEfetiva;
window.calcularOcupacaoPercentual = calcularOcupacaoPercentual;
window.calcularAutonomiaDias = calcularAutonomiaDias;
window.classificarCriticidade = classificarCriticidade;
window.calcularScoreCenario = calcularScoreCenario;
window.calcularVolumeIdeal = calcularVolumeIdeal;
window.CONSTANTES = CONSTANTES;
