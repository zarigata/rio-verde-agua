export function gerarPrevisaoDemanda(populacao, mes, consumoBase) {
    var baseDiaria = (populacao * consumoBase) / 1000;
    var fatoresSazonais = [1.02, 1.01, 0.98, 0.95, 1.00, 1.05, 1.00, 0.95, 0.97, 1.04, 1.03, 1.01];
    var fator = fatoresSazonais[((mes - 1) % 12 + 12) % 12];
    var crescimentoAnual = 1 + 0.015 * ((mes - 1) / 12);
    return baseDiaria * fator * crescimentoAnual;
}

export function gerarPrevisoesSazonais(mesesFuturos) {
    var populacao = 241494;
    var consumoBase = 150;
    var previsoes = [];
    for (var m = 1; m <= mesesFuturos; m++) {
        previsoes.push(gerarPrevisaoDemanda(populacao, m, consumoBase));
    }
    return previsoes;
}

export function calcularIntervaloConfianca(previsao) {
    var delta = Math.max(0.1, previsao * 0.1);
    return { min: previsao - delta, central: previsao, max: previsao + delta };
}

export function obterChuvaEstimada(mes) {
    var chuvas = [120, 110, 90, 60, 40, 30, 25, 20, 30, 50, 90, 120];
    return chuvas[((mes - 1) % 12 + 12) % 12];
}

export function obterTemperaturaEstimada(mes) {
    var temps = [23, 24, 25, 26, 28, 29, 30, 29, 28, 26, 25, 24];
    return temps[((mes - 1) % 12 + 12) % 12];
}

export function gerarRecomendacao(resultado) {
    if (!resultado) {
        return { texto: 'Configure a transferencia para obter uma recomendacao.', nivel: 'indesejavel', score: 0, detalhes: [] };
    }

    var detalhes = [];
    var score = 50;
    var nivel = 'indesejavel';

    if (resultado.origem.abaixoReserva) {
        detalhes.push('Origem ficara abaixo da reserva minima (' + resultado.origem.reservaMinima + ' m3).');
        score -= 30;
    } else if (resultado.origem.autonomiaDepois < 3) {
        detalhes.push('Autonomia da origem sera inferior a 3 dias.');
        score -= 15;
    }

    if (resultado.destino.abaixoReserva) {
        detalhes.push('Destino permanecera abaixo da reserva minima.');
        score -= 20;
    } else if (resultado.destino.autonomiaDepois < 3) {
        detalhes.push('Autonomia do destino permanecera inferior a 3 dias.');
        score -= 15;
    }

    if (resultado.perdaPercentual > 20) {
        detalhes.push('Perda operacional elevada: ' + resultado.perdaPercentual.toFixed(1) + '%.');
        score -= 10;
    }

    if (resultado.volumeTransferido <= 0) {
        detalhes.push('Nenhum volume transferido. Verifique os parametros.');
        score = 0;
    } else {
        if (resultado.destino.autonomiaDepois > resultado.destino.autonomiaAntes) {
            detalhes.push('Autonomia do destino melhorou de ' + resultado.destino.autonomiaAntes.toFixed(1) + ' para ' + resultado.destino.autonomiaDepois.toFixed(1) + ' dias.');
            score += 15;
        }
        if (!resultado.origem.abaixoReserva) {
            detalhes.push('Origem permanece acima da reserva minima.');
            score += 10;
        }
        detalhes.push('Volume transferido: ' + resultado.volumeTransferido.toFixed(0) + ' m3. Recebido no destino: ' + resultado.volumeRecebido.toFixed(0) + ' m3.');
    }

    score = Math.max(0, Math.min(100, score));

    if (score >= 70) nivel = 'viavel';
    else if (score >= 40) nivel = 'arriscado';
    else if (score >= 20) nivel = 'perigoso';
    else nivel = 'indesejavel';

    var textos = {
        viavel: 'Transferencia viavel. O cenario e favoravel para ambos os pontos.',
        arriscado: 'Transferencia arriscada. Verifique os alertas antes de prosseguir.',
        perigoso: 'Transferencia perigosa. Risco de desabastecimento em um ou ambos os pontos.',
        indesejavel: 'Transferencia nao recomendada. Revise os parametros ou selecione outros pontos.'
    };

    return {
        texto: textos[nivel],
        nivel: nivel,
        score: score,
        detalhes: detalhes
    };
}

window.gerarRecomendacao = gerarRecomendacao;
window.gerarPrevisaoDemanda = gerarPrevisaoDemanda;
window.gerarPrevisoesSazonais = gerarPrevisoesSazonais;
window.calcularIntervaloConfianca = calcularIntervaloConfianca;
window.obterChuvaEstimada = obterChuvaEstimada;
window.obterTemperaturaEstimada = obterTemperaturaEstimada;
