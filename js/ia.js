// Inteligência artificial simples (sem TensorFlow)

// Previsão de demanda baseada em população e fator sazonal simples
export function gerarPrevisaoDemanda(populacao, mes, consumoBase) {
  // Demanda base diária simples (m³/d)
  const baseDiaria = (populacao * consumoBase) / 1000;
  const fatoresSazonais = [1.02, 1.01, 0.98, 0.95, 1.00, 1.05, 1.00, 0.95, 0.97, 1.04, 1.03, 1.01];
  const idx = ((mes - 1) % 12 + 12) % 12;
  const fator = fatoresSazonais[idx];
  // Tendência de crescimento anual simples: 1,5% ao ano
  const crescimentoAnual = 1 + 0.015 * ((mes - 1) / 12);
  return baseDiaria * fator * crescimentoAnual;
}

export function gerarPrevisoesSazonais(mesesFuturos) {
  const populacao = 241494;
  const consumoBase = 150;
  const previsoes = [];
  for (let m = 1; m <= mesesFuturos; m++) {
    previsoes.push(gerarPrevisaoDemanda(populacao, m, consumoBase));
  }
  return previsoes;
}

export function calcularIntervaloConfianca(previsao) {
  const central = previsao;
  const delta = Math.max(0.1, previsao * 0.1);
  return { min: central - delta, central, max: central + delta };
}

export function obterChuvaEstimada(mes) {
  const chuvas = [120,110,90,60,40,30,25,20,30,50,90,120];
  const idx = ((mes - 1) % 12 + 12) % 12;
  return chuvas[idx];
}

export function obterTemperaturaEstimada(mes) {
  const temps = [23,24,25,26,28,29,30,29,28,26,25,24];
  const idx = ((mes - 1) % 12 + 12) % 12;
  return temps[idx];
}
