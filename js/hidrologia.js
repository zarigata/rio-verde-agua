// Hidrologia adaptada para cidade única: Rio Verde
// Importante: manter as fórmulas existentes, apenas adaptar o escopo

export const CONSTANTES = {
  diasReserva: 7,
  consumoBaseLitrosDia: 150,
  fatorIndustrial: 1.0
};

// Demanda diária (m³/d) com ajuste de industrial
export function calcularDemandaDiaria(populacao, consumoLitrosDia, fatorIndustrial) {
  const fator = (fatorIndustrial ?? 1.0);
  const demandaLitros = populacao * consumoLitrosDia * fator;
  // 1000 litros = 1 m³
  return demandaLitros / 1000;
}

// Demanda mensal (m³/mês) a partir da diária
export function calcularDemandaMensal(demandaDiaria, dias) {
  return demandaDiaria * (dias ?? 30);
}

// Produção efetiva após perdas (%)
export function calcularProducaoEfetiva(producaoBruta, perdaPercentual) {
  const perda = (perdaPercentual ?? 0) / 100;
  return producaoBruta * (1 - perda);
}

// Balanço hídrico simples, adaptado a nível de reservatório (percentual 0-100)
export function calcularBalancoHidrico(producao, demanda, nivelReservatorio) {
  const fatorNivel = Math.max(0, Math.min(1, (nivelReservatorio ?? 0) / 100));
  const balanco = (producao - demanda) * fatorNivel;
  return balanco;
}

// Índice de estresse hídrico (indicativo)
export function calcularIndiceEstresseHidrico(demanda, disponibilidade) {
  const disp = Math.max(1, disponibilidade ?? 1);
  return demanda / disp;
}

// Consumo sazonal (m³/d) com base mensal; usa fatores simples por mês
export function calcularConsumoSazonal(consumoBase, mes) {
  const fatores = [1.02, 1.01, 0.98, 0.95, 1.00, 1.05, 1.00, 0.95, 0.97, 1.04, 1.03, 1.01];
  const idx = ((mes - 1) % 12 + 12) % 12;
  const fator = fatores[idx];
  return consumoBase * fator;
}

// Efeito climático sobre produção (simulações simples)
export function calcularEfeitoClimatico(tipoEvento, producaoBase) {
  if (!tipoEvento) return producaoBase;
  switch (tipoEvento) {
    case 'seca':
      return producaoBase * 0.6;
    case 'chuva_intensa':
      return producaoBase * 1.4;
    default:
      return producaoBase;
  }
}

// Reserva mínima para garantir funcionamento (m³)
export function calcularReservaMinima(demandaDiaria, diasReserva) {
  return demandaDiaria * (diasReserva ?? 1);
}

// NOTAS: Funções removidas para operação única da cidade (Rio Verde)
