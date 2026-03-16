/**
 * hidrologia.js - Módulo de cálculos hidrológicos
 * Plataforma de Gerenciamento Hídrico Urbano
 * 
 * Contém todas as fórmulas e cálculos científicos para:
 * - Demanda de água
 * - Balanço hídrico
 * - Índice de estresse hídrico
 */

// Constantes do sistema
const CONSTANTES = {
    LITROS_POR_PESSOA_DIA: 150,
    PERDA_PERCENTUAL: 25,
    RESERVA_MINIMA_PERCENTUAL: 20,
    DIAS_NO_MES: 30,
    FATOR_SECA: 0.6,
    FATOR_CHUVA_INTENSA: 1.4,
    FATOR_CRES_POPULACIONAL: 1.02,
    FATOR_INDUSTRIAL_BASE: 1.15
};

/**
 * Calcula a demanda diária de água de uma cidade
 * @param {number} populacao - Número de habitantes
 * @param {number} consumoLitrosDia - Consumo médio em litros por pessoa/dia
 * @param {number} fatorIndustrial - Fator de ajuste industrial (padrão 1.0)
 * @returns {number} Demanda em m³/dia
 */
function calcularDemandaDiaria(populacao, consumoLitrosDia = CONSTANTES.LITROS_POR_PESSOA_DIA, fatorIndustrial = 1.0) {
    // Fórmula: (população × consumo) / 1000 = m³/dia
    // Aplica fator industrial para cidades com atividade industrial
    const demandaLitros = populacao * consumoLitrosDia * fatorIndustrial;
    const demandaM3 = demandaLitros / 1000;
    return Math.round(demandaM3);
}

/**
 * Calcula a demanda mensal de água
 * @param {number} demandaDiaria - Demanda diária em m³
 * @param {number} dias - Número de dias no período
 * @returns {number} Demanda mensal em m³
 */
function calcularDemandaMensal(demandaDiaria, dias = CONSTANTES.DIAS_NO_MES) {
    return Math.round(demandaDiaria * dias);
}

/**
 * Calcula a produção efetiva de água considerando perdas
 * @param {number} producaoBruta - Produção bruta em m³/dia
 * @param {number} perdaPercentual - Percentual de perda no sistema
 * @returns {number} Produção efetiva em m³/dia
 */
function calcularProducaoEfetiva(producaoBruta, perdaPercentual = CONSTANTES.PERDA_PERCENTUAL) {
    const fatorEfetivo = (100 - perdaPercentual) / 100;
    return Math.round(producaoBruta * fatorEfetivo);
}

/**
 * Calcula o balanço hídrico de uma cidade
 * @param {number} producao - Produção de água em m³
 * @param {number} demanda - Demanda de água em m³
 * @param {number} nivelReservatorio - Nível atual do reservatório em m³
 * @returns {Object} Objeto com balanço, déficit e status
 */
function calcularBalancoHidrico(producao, demanda, nivelReservatorio) {
    // Balanço = Produção - Demanda + Reservatório
    const balanco = producao - demanda + nivelReservatorio;
    const deficit = demanda - producao;
    const excedente = Math.max(0, producao - demanda);
    
    // Determina status
    let status;
    if (balanco >= demanda * 1.2) {
        status = 'normal';
    } else if (balanco >= demanda * 0.8) {
        status = 'pressao';
    } else {
        status = 'critico';
    }
    
    return {
        balanco: Math.round(balanco),
        deficit: Math.round(deficit),
        excedente: Math.round(excedente),
        status: status,
        percentualAtendimento: Math.min(100, Math.round((producao + nivelReservatorio) / demanda * 100))
    };
}

/**
 * Calcula o Índice de Estresse Hídrico (IEH)
 * @param {number} demanda - Demanda de água em m³
 * @param {number} disponibilidade - Disponibilidade de água em m³
 * @returns {Object} IEH e classificação
 */
function calcularIndiceEstresseHidrico(demanda, disponibilidade) {
    if (disponibilidade === 0) {
        return { ieh: Infinity, classificacao: 'sem_agua', descricao: 'Sem água disponível' };
    }
    
    const ieh = demanda / disponibilidade;
    
    let classificacao, descricao;
    if (ieh < 0.1) {
        classificacao = 'sem_estresse';
        descricao = 'Sem estresse hídrico';
    } else if (ieh < 0.2) {
        classificacao = 'baixo';
        descricao = 'Baixo estresse hídrico';
    } else if (ieh < 0.4) {
        classificacao = 'moderado';
        descricao = 'Estresse hídrico moderado';
    } else if (ieh < 0.8) {
        classificacao = 'alto';
        descricao = 'Alto estresse hídrico';
    } else {
        classificacao = 'extremo';
        descricao = 'Estresse hídrico extremo';
    }
    
    return {
        ieh: Math.round(ieh * 100) / 100,
        classificacao: classificacao,
        descricao: descricao
    };
}

/**
 * Calcula o efeito de um evento climático na produção
 * @param {string} tipoEvento - Tipo do evento ('seca', 'chuva_intensa', 'normal')
 * @param {number} producaoBase - Produção base em m³/dia
 * @returns {number} Produção ajustada em m³/dia
 */
function calcularEfeitoClimatico(tipoEvento, producaoBase) {
    switch (tipoEvento) {
        case 'seca':
            return Math.round(producaoBase * CONSTANTES.FATOR_SECA);
        case 'chuva_intensa':
            return Math.round(producaoBase * CONSTANTES.FATOR_CHUVA_INTENSA);
        default:
            return producaoBase;
    }
}

/**
 * Calcula o consumo ajustado por estação do ano
 * @param {number} consumoBase - Consumo base em m³
 * @param {number} mes - Mês (1-12)
 * @returns {Object} Consumo ajustado e estação
 */
function calcularConsumoSazonal(consumoBase, mes) {
    let estacao, fator;
    
    if ([12, 1, 2].includes(mes)) {
        estacao = 'verao';
        fator = 1.15;
    } else if ([3, 4, 5].includes(mes)) {
        estacao = 'outono';
        fator = 1.05;
    } else if ([6, 7, 8].includes(mes)) {
        estacao = 'inverno';
        fator = 0.95;
    } else {
        estacao = 'primavera';
        fator = 1.00;
    }
    
    return {
        consumoAjustado: Math.round(consumoBase * fator),
        estacao: estacao,
        fatorSazonal: fator
    };
}

/**
 * Calcula a capacidade de transferência entre cidades
 * @param {number} distanciaKm - Distância em quilômetros
 * @param {number} capacidadeMaxima - Capacidade máxima de transferência em m³/dia
 * @param {number} excedenteDisponivel - Excedente disponível na cidade origem
 * @returns {number} Capacidade efetiva de transferência
 */
function calcularCapacidadeTransferencia(distanciaKm, capacidadeMaxima, excedenteDisponivel) {
    // Redução de 1% por km de distância
    const fatorDistancia = Math.max(0.5, 1 - (distanciaKm * 0.01));
    const capacidadeAjustada = capacidadeMaxima * fatorDistancia;
    
    // Limita ao excedente disponível
    return Math.round(Math.min(capacidadeAjustada, excedenteDisponivel));
}

/**
 * Calcula a reserva mínima necessária
 * @param {number} demandaDiaria - Demanda diária em m³
 * @param {number} diasReserva - Dias de reserva desejados
 * @returns {number} Reserva mínima em m³
 */
function calcularReservaMinima(demandaDiaria, diasReserva = 3) {
    return Math.round(demandaDiaria * diasReserva);
}

/**
 * Gera relatório completo de uma cidade
 * @param {Object} cidade - Objeto da cidade
 * @returns {Object} Relatório completo
 */
function gerarRelatorioCidade(cidade) {
    const demandaDiaria = calcularDemandaDiaria(
        cidade.populacao, 
        cidade.consumo_medio_litros_dia,
        cidade.fator_industrial
    );
    const demandaMensal = calcularDemandaMensal(demandaDiaria);
    const producaoEfetiva = calcularProducaoEfetiva(cidade.producao_diaria_m3);
    const balanco = calcularBalancoHidrico(
        producaoEfetiva, 
        demandaDiaria, 
        cidade.nivel_atual_reservatorio_m3
    );
    const ieh = calcularIndiceEstresseHidrico(demandaDiaria, producaoEfetiva + cidade.nivel_atual_reservatorio_m3);
    const reservaMinima = calcularReservaMinima(demandaDiaria);
    
    return {
        cidade: cidade.nome,
        populacao: cidade.populacao,
        demandaDiariaM3: demandaDiaria,
        demandaMensalM3: demandaMensal,
        producaoDiariaM3: cidade.producao_diaria_m3,
        producaoEfetivaM3: producaoEfetiva,
        nivelReservatorioM3: cidade.nivel_atual_reservatorio_m3,
        capacidadeReservatorioM3: cidade.capacidade_reservatorio_m3,
        percentualReservatorio: Math.round((cidade.nivel_atual_reservatorio_m3 / cidade.capacidade_reservatorio_m3) * 100),
        balancoHidrico: balanco,
        indiceEstresseHidrico: ieh,
        reservaMinimaM3: reservaMinima,
        formulas: {
            demanda: `Demanda = ${cidade.populacao.toLocaleString('pt-BR')} hab × ${cidade.consumo_medio_litros_dia} L/hab/dia ÷ 1000 = ${demandaDiaria.toLocaleString('pt-BR')} m³/dia`,
            producaoEfetiva: `Produção Efetiva = ${cidade.producao_diaria_m3.toLocaleString('pt-BR')} m³ × ${(100 - CONSTANTES.PERDA_PERCENTUAL)}% = ${producaoEfetiva.toLocaleString('pt-BR')} m³`,
            ieh: `IEH = Demanda / Disponibilidade = ${demandaDiaria.toLocaleString('pt-BR')} / ${(producaoEfetiva + cidade.nivel_atual_reservatorio_m3).toLocaleString('pt-BR')} = ${ieh.ieh}`
        }
    };
}

// Exporta funções para uso em outros módulos
export {
    CONSTANTES,
    calcularDemandaDiaria,
    calcularDemandaMensal,
    calcularProducaoEfetiva,
    calcularBalancoHidrico,
    calcularIndiceEstresseHidrico,
    calcularEfeitoClimatico,
    calcularConsumoSazonal,
    calcularCapacidadeTransferencia,
    calcularReservaMinima,
    gerarRelatorioCidade
};
