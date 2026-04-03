let cache = null;
let cachePontos = null;

async function carregarDados() {
    if (cache) return cache;

    const [respInfra, respFontes] = await Promise.all([
        fetch('data/infraestrutura-rio-verde.json'),
        fetch('data/fontes.json')
    ]);

    if (!respInfra.ok) throw new Error('Falha ao carregar infraestrutura: ' + respInfra.status);
    if (!respFontes.ok) throw new Error('Falha ao carregar fontes: ' + respFontes.status);

    const dadosInfra = await respInfra.json();
    const dadosFontes = await respFontes.json();

    if (!dadosInfra.infraestrutura || !Array.isArray(dadosInfra.infraestrutura)) {
        throw new Error('Dados de infraestrutura invalidos');
    }
    if (!dadosInfra.indicadores_municipais || typeof dadosInfra.indicadores_municipais !== 'object') {
        throw new Error('Dados de indicadores invalidos');
    }
    if (!dadosFontes.fontes || !Array.isArray(dadosFontes.fontes)) {
        throw new Error('Dados de fontes invalidos');
    }

    cache = {
        infraestrutura: dadosInfra.infraestrutura,
        indicadores: dadosInfra.indicadores_municipais,
        fontes: dadosFontes.fontes,
        metadata: dadosInfra.metadata || {}
    };

    return cache;
}

async function carregarPontosSimulacao() {
    if (cachePontos) return cachePontos;

    const resp = await fetch('data/pontos-simulacao.json');
    if (!resp.ok) throw new Error('Falha ao carregar pontos de simulacao: ' + resp.status);

    const dados = await resp.json();

    if (!dados.pontos || !Array.isArray(dados.pontos)) {
        throw new Error('Dados de pontos invalidos');
    }

    cachePontos = {
        pontos: dados.pontos,
        conexoes: dados.conexoes || [],
        parametros_globais: dados.parametros_globais || {},
        metadata: dados.metadata || {}
    };

    return cachePontos;
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
    if (!cache) throw new Error('Dados nao carregados.');
    return cache.infraestrutura.find(function(item) { return item.id === id; }) || null;
}

function getItensPorTipo(tipo) {
    if (!cache) throw new Error('Dados nao carregados.');
    return cache.infraestrutura.filter(function(item) { return item.tipo === tipo; });
}

function getItensPorCerteza(nivel) {
    if (!cache) throw new Error('Dados nao carregados.');
    return cache.infraestrutura.filter(function(item) { return item.certeza_nivel === nivel; });
}

function obterPontos() {
    if (!cachePontos) throw new Error('Pontos nao carregados. Chame carregarPontosSimulacao() primeiro.');
    return cachePontos.pontos;
}

function obterConexoes() {
    if (!cachePontos) throw new Error('Pontos nao carregados.');
    return cachePontos.conexoes;
}

function obterParametrosGlobais() {
    if (!cachePontos) throw new Error('Pontos nao carregados.');
    return cachePontos.parametros_globais;
}

export {
    carregarDados, carregarPontosSimulacao,
    obterInfraestrutura, obterIndicadores, obterFontes, obterMetadata,
    getItemPorId, getItensPorTipo, getItensPorCerteza,
    obterPontos, obterConexoes, obterParametrosGlobais
};
