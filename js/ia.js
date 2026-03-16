let modelo = null;
let historicoTreino = [];
const TAXA_APRENDIZADO = 0.01;
const EPOCAS = 50;

async function criarModelo() {
    modelo = tf.sequential();
    
    modelo.add(tf.layers.dense({
        units: 16,
        activation: 'relu',
        inputShape: [5]
    }));
    
    modelo.add(tf.layers.dense({
        units: 8,
        activation: 'relu'
    }));
    
    modelo.add(tf.layers.dense({
        units: 1,
        activation: 'linear'
    }));
    
    modelo.compile({
        optimizer: tf.train.adam(TAXA_APRENDIZADO),
        loss: 'meanSquaredError'
    });
}

function normalizarEntradas(dados) {
    const limites = {
        populacaoMin: 0, populacaoMax: 300000,
        chuvaMin: 0, chuvaMax: 300,
        temperaturaMin: 15, temperaturaMax: 35,
        estacaoMin: 0, estacaoMax: 3,
        historicoMin: 0, historicoMax: 2000000
    };
    
    return dados.map((valor, indice) => {
        const chaves = Object.keys(limites);
        const chaveMin = chaves[indice * 2];
        const chaveMax = chaves[indice * 2 + 1];
        const min = limites[chaveMin];
        const max = limites[chaveMax];
        return (valor - min) / (max - min);
    });
}

function codificarEstacao(mes) {
    if ([12, 1, 2].includes(mes)) return 0;
    if ([3, 4, 5].includes(mes)) return 1;
    if ([6, 7, 8].includes(mes)) return 2;
    return 3;
}

async function treinarModelo(dadosHistorico) {
    if (!modelo) await criarModelo();
    
    const entradas = [];
    const saidas = [];
    
    dadosHistorico.forEach(registro => {
        const entrada = normalizarEntradas([
            registro.populacao || 100000,
            registro.chuva_mm || 100,
            registro.temperatura_media || 25,
            codificarEstacao(registro.mes),
            registro.consumo_anterior || registro.consumo_m3 || 50000
        ]);
        
        entradas.push(entrada);
        saidas.push([registro.consumo_m3 / 2000000]);
    });
    
    if (entradas.length === 0) return;
    
    const xs = tf.tensor2d(entradas);
    const ys = tf.tensor2d(saidas);
    
    await modelo.fit(xs, ys, {
        epochs: EPOCAS,
        batchSize: Math.min(32, entradas.length),
        shuffle: true,
        verbose: 0
    });
    
    xs.dispose();
    ys.dispose();
}

async function preverDemanda(populacao, chuva, temperatura, mes, historicoConsumo) {
    if (!modelo) await criarModelo();
    
    const entrada = normalizarEntradas([
        populacao,
        chuva,
        temperatura,
        codificarEstacao(mes),
        historicoConsumo
    ]);
    
    const tensor = tf.tensor2d([entrada]);
    const previsao = modelo.predict(tensor);
    const valor = previsao.dataSync()[0];
    
    tensor.dispose();
    previsao.dispose();
    
    const demandaReal = valor * 2000000;
    
    return Math.round(demandaReal);
}

async function gerarPrevisoesFuturas(cidade, diasFuturos = 7) {
    if (!modelo) await criarModelo();
    
    const previsoes = [];
    const estadoAtual = cidade;
    
    for (let i = 0; i < diasFuturos; i++) {
        const mes = new Date().getMonth() + 1;
        const chuvaEstimada = obterChuvaEstimada(mes);
        const temperaturaEstimada = obterTemperaturaEstimada(mes);
        
        const previsao = await preverDemanda(
            estadoAtual.populacao,
            chuvaEstimada,
            temperaturaEstimada,
            mes,
            estadoAtual.demandaAtualM3 * 30
        );
        
        previsoes.push({
            dia: i + 1,
            demandaPrevista: previsao,
            chuvaEstimada: chuvaEstimada,
            temperaturaEstimada: temperaturaEstimada
        });
    }
    
    return previsoes;
}

function obterChuvaEstimada(mes) {
    const chuvaPorMes = {
        1: 250, 2: 220, 3: 180, 4: 80, 5: 30, 6: 10,
        7: 5, 8: 10, 9: 80, 10: 150, 11: 200, 12: 250
    };
    return chuvaPorMes[mes] || 100;
}

function obterTemperaturaEstimada(mes) {
    const tempPorMes = {
        1: 26, 2: 27, 3: 28, 4: 29, 5: 30, 6: 31,
        7: 32, 8: 31, 9: 29, 10: 28, 11: 27, 12: 26
    };
    return tempPorMes[mes] || 28;
}

function calcularConfianca(previsoes) {
    if (previsoes.length < 2) return 50;
    
    const variacoes = [];
    for (let i = 1; i < previsoes.length; i++) {
        const variacao = Math.abs(previsoes[i].demandaPrevista - previsoes[i-1].demandaPrevista) / previsoes[i-1].demandaPrevista;
        variacoes.push(variacao);
    }
    
    const mediaVariacao = variacoes.reduce((a, b) => a + b, 0) / variacoes.length;
    const confianca = Math.max(30, Math.min(95, 100 - (mediaVariacao * 100)));
    
    return Math.round(confianca);
}

function destruirModelo() {
    if (modelo) {
        modelo.dispose();
        modelo = null;
    }
}

export {
    criarModelo,
    treinarModelo,
    preverDemanda,
    gerarPrevisoesFuturas,
    calcularConfianca,
    destruirModelo,
    codificarEstacao,
    obterChuvaEstimada,
    obterTemperaturaEstimada
};
