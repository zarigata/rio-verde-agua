// Redistribuição interna (simplificada para cidade única)

export function verificarNecessidadeRedistribuicao(producao, demanda) {
  return (producao < demanda);
}

export function calcularCenarioEmergencia(tipoEvento) {
  const cenarios = {
    seca: { producaoFactor: 0.6 },
    chuva_intensa: { producaoFactor: 1.25 }
  };
  return cenarios[tipoEvento] ?? { producaoFactor: 1.0 };
}
