export function verificarNecessidadeRedistribuicao(producao, demanda) {
    return producao < demanda;
}

export function calcularCenarioEmergencia(tipoEvento) {
    var cenarios = { seca: { producaoFactor: 0.6 }, chuva_intensa: { producaoFactor: 1.25 } };
    return cenarios[tipoEvento] || { producaoFactor: 1.0 };
}

export function calcularTransferenciaViavel(origem, destino, perdaPercentual) {
    var volumeDisponivel = Math.max(0, origem.volume_atual_m3 - origem.reserva_minima_m3);
    var espacoDestino = destino.capacidade_maxima_m3 - destino.volume_atual_m3;
    var perda = (perdaPercentual || 0) / 100;
    var volumeIdeal = Math.min(volumeDisponivel, espacoDestino / (1 - perda));

    if (destino.consumo_medio_m3_dia > 0) {
        var necessario = destino.consumo_medio_m3_dia * 7;
        var deficit = Math.max(0, necessario - destino.volume_atual_m3);
        volumeIdeal = Math.min(volumeIdeal, deficit / (1 - perda));
    }
    volumeIdeal = Math.max(0, Math.round(volumeIdeal));

    var viavel = volumeIdeal > 0 && volumeDisponivel > 0;
    var motivo = '';

    if (!viavel) {
        if (volumeDisponivel <= 0) motivo = 'Origem nao possui volume disponivel (abaixo da reserva minima).';
        else motivo = 'Destino nao possui espaco para receber agua.';
    }

    return { viavel: viavel, volumeMaximo: volumeDisponivel, volumeIdeal: volumeIdeal, motivo: motivo };
}

export function calcularMelhorTransferencia(pontos) {
    var melhor = null;
    var melhorScore = -Infinity;

    for (var i = 0; i < pontos.length; i++) {
        for (var j = 0; j < pontos.length; j++) {
            if (i === j) continue;
            var origem = pontos[i];
            var destino = pontos[j];
            if (origem.tipo === 'manancial' && destino.tipo === 'manancial') continue;
            if (origem.consumo_medio_m3_dia <= 0 && destino.consumo_medio_m3_dia <= 0) continue;

            var info = calcularTransferenciaViavel(origem, destino, 5);
            if (!info.viavel) continue;

            var ocupacaoDestino = destino.volume_atual_m3 > 0
                ? (destino.volume_atual_m3 / destino.capacidade_maxima_m3) * 100
                : 0;
            var score = info.volumeIdeal;

            if (ocupacaoDestino < 40) score *= 2;
            else if (ocupacaoDestino < 70) score *= 1.5;

            if (destino.prioridade === 'critica') score *= 2;
            else if (destino.prioridade === 'alta') score *= 1.5;

            var ocupacaoOrigem = origem.volume_atual_m3 > 0
                ? (origem.volume_atual_m3 / origem.capacidade_maxima_m3) * 100
                : 100;
            if (ocupacaoOrigem > 70) score *= 1.2;

            if (score > melhorScore) {
                melhorScore = score;
                melhor = {
                    origemId: origem.id,
                    destinoId: destino.id,
                    origemNome: origem.nome,
                    destinoNome: destino.nome,
                    volume: info.volumeIdeal,
                    score: score,
                    motivo: 'Melhor cenario encontrado pela analise de equilibrio.'
                };
            }
        }
    }

    return melhor || {
        origemId: null,
        destinoId: null,
        volume: 0,
        score: 0,
        motivo: 'Nenhuma transferencia viavel encontrada entre os pontos atuais.'
    };
}

window.calcularTransferenciaViavel = calcularTransferenciaViavel;
window.calcularMelhorTransferencia = calcularMelhorTransferencia;
window.verificarNecessidadeRedistribuicao = verificarNecessidadeRedistribuicao;
