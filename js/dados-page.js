import { carregarDados } from './data.js';

function renderizarTabela(itens) {
    var container = document.getElementById('tabela-infraestrutura');
    if (!container) return;

    var tipoLabel = {
        captacao: 'Captacao', captacao_natural: 'Manancial', tratamento: 'Tratamento',
        reservacao: 'Reservacao', tratamento_esgoto: 'Tratamento de Esgoto', distribuicao: 'Distribuicao'
    };
    var certezaCores = { confirmed: '#16a34a', derived: '#f59e0b', approximate: '#ef4444' };
    var certezaLabels = { confirmed: 'Confirmado', derived: 'Derivado', approximate: 'Aproximado' };
    var statusLabels = { operacional: 'Operacional', em_construcao: 'Em construcao' };

    var html = '<div class="tabela-responsiva"><table><thead><tr>' +
        '<th>Nome</th><th>Tipo</th><th>Capacidade</th><th>Certeza</th><th>Status</th><th>Fonte</th>' +
        '</tr></thead><tbody>';

    itens.forEach(function(item) {
        var capacidade = item.capacidade_valor != null ? item.capacidade_valor + ' ' + item.capacidade_unidade : '—';
        var certezaCor = certezaCores[item.certeza_nivel] || '#999';
        var certezaLbl = certezaLabels[item.certeza_nivel] || item.certeza_nivel;
        var status = statusLabels[item.status_operacional] || item.status_operacional;
        var fonteTitulo = item.fonte_titulo ? item.fonte_titulo.substring(0, 50) + '...' : 'Ver fonte';
        var endereco = item.endereco_aproximado || '';

        html += '<tr>' +
            '<td><strong>' + item.nome + '</strong><br><small style="color:var(--cor-texto-claro)">' + endereco + '</small></td>' +
            '<td>' + (tipoLabel[item.tipo] || item.tipo) + '</td>' +
            '<td>' + capacidade + '</td>' +
            '<td><span style="display:inline-flex;align-items:center;gap:0.3rem;">' +
            '<span style="width:8px;height:8px;border-radius:50%;background:' + certezaCor + ';display:inline-block;"></span>' +
            certezaLbl + '</span></td>' +
            '<td>' + status + '</td>' +
            '<td><a href="' + item.fonte_url + '" target="_blank" rel="noopener">' + fonteTitulo + '</a></td>' +
            '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function renderizarIndicadores(indicadores) {
    var container = document.getElementById('indicadores-container');
    if (!container) return;

    var linhas = [
        { label: 'Populacao total', valor: indicadores.populacao_total.toLocaleString('pt-BR') + ' hab', fonte: indicadores.populacao_fonte },
        { label: 'Cobertura agua (urbana)', valor: indicadores.cobertura_agua_urbana_percentual + '%', fonte: indicadores.cobertura_agua_fonte },
        { label: 'Cobertura esgoto (urbana)', valor: indicadores.cobertura_esgoto_urbana_percentual + '%', fonte: indicadores.cobertura_esgoto_fonte },
        { label: 'Rede coletora', valor: indicadores.rede_coletora_km + ' km', fonte: indicadores.rede_coletora_fonte },
        { label: 'Esgoto tratado', valor: indicadores.esgoto_tratado_milhoes_litros_dia + ' milhoes L/dia', fonte: indicadores.esgoto_tratado_fonte },
        { label: 'Consumo medio per capita', valor: indicadores.consumo_medio_litros_dia + ' L/hab/dia', fonte: indicadores.consumo_medio_fonte },
        { label: 'Extensao rede agua', valor: Number(indicadores.extensao_rede_agua_m).toLocaleString('pt-BR') + ' m', fonte: indicadores.extensao_rede_agua_fonte },
        { label: 'Extensao rede esgoto', valor: Number(indicadores.extensao_rede_esgoto_m).toLocaleString('pt-BR') + ' m', fonte: indicadores.extensao_rede_esgoto_fonte },
        { label: 'Ligacoes agua', valor: Number(indicadores.conexoes_agua).toLocaleString('pt-BR'), fonte: indicadores.conexoes_agua_fonte },
        { label: 'Ligacoes esgoto', valor: Number(indicadores.conexoes_esgoto).toLocaleString('pt-BR'), fonte: indicadores.conexoes_esgoto_fonte }
    ];

    var html = '<div class="tabela-responsiva"><table><thead><tr><th>Indicador</th><th>Valor</th><th>Fonte</th></tr></thead><tbody>';
    linhas.forEach(function(l) {
        html += '<tr><td>' + l.label + '</td><td><strong>' + l.valor + '</strong></td>' +
            '<td><small style="color:var(--cor-texto-claro)">' + (l.fonte || '—') + '</small></td></tr>';
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function renderizarFontes(fontes) {
    var container = document.getElementById('fontes-container');
    if (!container) return;

    container.innerHTML = fontes.map(function(f) {
        var dadosList = '';
        if (f.dados_extraidos && f.dados_extraidos.length > 0) {
            dadosList = '<p><strong>Dados extraidos:</strong></p><ul>' +
                f.dados_extraidos.map(function(d) { return '<li>' + d + '</li>'; }).join('') +
                '</ul>';
        }
        var observacao = f.observacao ? '<p style="color:var(--cor-aproximado);font-weight:600;">' + f.observacao + '</p>' : '';

        return '<div class="fonte-item">' +
            '<h4>' + f.titulo + '</h4>' +
            '<p><strong>Autor:</strong> ' + (f.autor || '—') + ' | <strong>Tipo:</strong> ' + (f.tipo || '—') + ' | <strong>Data:</strong> ' + (f.data_publicacao || '—') + '</p>' +
            '<p><strong>URL:</strong> <a href="' + f.url + '" target="_blank" rel="noopener">' + f.url + '</a></p>' +
            '<p><strong>Status:</strong> ' + (f.status_acesso || '—') + '</p>' +
            '<p><strong>Acessado em:</strong> ' + (f.acessado_em || '—') + '</p>' +
            dadosList + observacao +
            '</div>';
    }).join('');
}

document.addEventListener('DOMContentLoaded', async function() {
    try {
        var dados = await carregarDados();
        renderizarTabela(dados.infraestrutura);
        renderizarIndicadores(dados.indicadores);
        renderizarFontes(dados.fontes);
    } catch (erro) {
        var container = document.querySelector('.conteudo');
        if (container) {
            container.innerHTML = '<p style="color:var(--cor-aproximado);">Erro ao carregar dados: ' + erro.message + '</p>';
        }
    }
});
