/**
 * data.js - Carregador de dados JSON para o site companion TCC
 * Modulo ES responsavel por carregar, cachear e fornecer acesso
 * aos dados de infraestrutura e fontes do municipio de Rio Verde/GO.
 */

let cache = null;

async function carregarDados() {
    if (cache) return cache;

    const [respInfra, respFontes] = await Promise.all([
        fetch('data/infraestrutura-rio-verde.json'),
        fetch('data/fontes.json')
    ]);

    if (!respInfra.ok) {
        throw new Error(`Falha ao carregar infraestrutura: ${respInfra.status}`);
    }
    if (!respFontes.ok) {
        throw new Error(`Falha ao carregar fontes: ${respFontes.status}`);
    }

    const dadosInfra = await respInfra.json();
    const dadosFontes = await respFontes.json();

    if (!dadosInfra.infraestrutura || !Array.isArray(dadosInfra.infraestrutura)) {
        throw new Error('Dados de infraestrutura invalidos: campo "infraestrutura" ausente ou nao e um array');
    }
    if (!dadosInfra.indicadores_municipais || typeof dadosInfra.indicadores_municipais !== 'object') {
        throw new Error('Dados de indicadores invalidos: campo "indicadores_municipais" ausente');
    }
    if (!dadosFontes.fontes || !Array.isArray(dadosFontes.fontes)) {
        throw new Error('Dados de fontes invalidos: campo "fontes" ausente ou nao e um array');
    }

    cache = {
        infraestrutura: dadosInfra.infraestrutura,
        indicadores: dadosInfra.indicadores_municipais,
        fontes: dadosFontes.fontes,
        metadata: dadosInfra.metadata || {}
    };

    return cache;
}

function obterInfraestrutura() {
    if (!cache) throw new Error('Dados nao carregados. Chame carregarDados() primeiro.');
    return cache.infraestrutura;
}

function obterIndicadores() {
    if (!cache) throw new Error('Dados nao carregados. Chame carregarDados() primeiro.');
    return cache.indicadores;
}

function obterFontes() {
    if (!cache) throw new Error('Dados nao carregados. Chame carregarDados() primeiro.');
    return cache.fontes;
}

function obterMetadata() {
    if (!cache) throw new Error('Dados nao carregados. Chame carregarDados() primeiro.');
    return cache.metadata;
}

function getItemPorId(id) {
    if (!cache) throw new Error('Dados nao carregados. Chame carregarDados() primeiro.');
    return cache.infraestrutura.find(item => item.id === id) || null;
}

function getItensPorTipo(tipo) {
    if (!cache) throw new Error('Dados nao carregados. Chame carregarDados() primeiro.');
    return cache.infraestrutura.filter(item => item.tipo === tipo);
}

function getItensPorCerteza(nivel) {
    if (!cache) throw new Error('Dados nao carregados. Chame carregarDados() primeiro.');
    return cache.infraestrutura.filter(item => item.certeza_nivel === nivel);
}

export {
    carregarDados,
    obterInfraestrutura,
    obterIndicadores,
    obterFontes,
    obterMetadata,
    getItemPorId,
    getItensPorTipo,
    getItensPorCerteza
};
