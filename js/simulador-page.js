(function() {
    var pontosOriginais = [];
    var pontosAtuais = [];
    var sessionLog = [];

    var CORES_CRITICIDADE = { normal: '#16a34a', atencao: '#f59e0b', risco: '#f97316', critico: '#ef4444' };
    var LABELS_PRIORIDADE = { baixa: 'Baixa', media: 'Media', alta: 'Alta', critica: 'Critica' };
    var LABELS_TIPO = { eta: 'ETA', reservatorio: 'Reservatorio', zona_abastecimento: 'Zona', manancial: 'Manancial' };

    function ocupacao(ponto) {
        if (!ponto.capacidade_maxima_m3) return 0;
        return Math.min(100, Math.max(0, (ponto.volume_atual_m3 / ponto.capacidade_maxima_m3) * 100));
    }

    function autonomia(ponto) {
        if (!ponto.consumo_medio_m3_dia || ponto.consumo_medio_m3_dia <= 0) return Infinity;
        return ponto.volume_atual_m3 / ponto.consumo_medio_m3_dia;
    }

    function criticidade(ponto) {
        var oc = ocupacao(ponto);
        if (oc > 70) return 'normal';
        if (oc > 40) return 'atencao';
        if (oc > 20) return 'risco';
        return 'critico';
    }

    function formatarDias(d) {
        if (d === Infinity) return 'N/A';
        return d.toFixed(1);
    }

    function popularSelects() {
        var selOrigem = document.getElementById('sel-origem');
        var selDestino = document.getElementById('sel-destino');
        if (!selOrigem || !selDestino) return;

        var opts = '<option value="">Selecione...</option>';
        pontosOriginais.forEach(function(p) {
            var label = p.nome + ' (' + LABELS_TIPO[p.tipo] + p.tipo + ')';
            opts += '<option value="' + p.id + '">' + label + '</option>';
        });
        selOrigem.innerHTML = opts;
        selDestino.innerHTML = opts;
    }

    function mostrarInfoPonto(pontoId, containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;

        var ponto = null;
        for (var i = 0; i < pontosAtuais.length; i++) {
            if (pontosAtuais[i].id === pontoId) { ponto = pontosAtuais[i]; break; }
        }
        if (!ponto) { container.innerHTML = ''; return; }

        var oc = ocupacao(ponto).toFixed(1);
        var aut = formatarDias(autonomia(ponto));
        var crit = criticidade(ponto);
        var cor = CORES_CRITICIDADE[crit];

        container.innerHTML =
            '<div class="sim-info-row"><span>Tipo:</span> <strong>' + (LABELS_TIPO[ponto.tipo] || ponto.tipo) + '</strong></div>' +
            '<div class="sim-info-row"><span>Capacidade:</span> <strong>' + ponto.capacidade_maxima_m3.toLocaleString('pt-BR') + ' m3</strong></div>' +
            '<div class="sim-info-row"><span>Volume atual:</span> <strong>' + ponto.volume_atual_m3.toLocaleString('pt-BR') + ' m3</strong></div>' +
            '<div class="sim-info-row"><span>Ocupacao:</span> <strong style="color:' + cor + '">' + oc + '%</strong></div>' +
            '<div class="sim-info-row"><span>Autonomia:</span> <strong>' + aut + ' dias</strong></div>' +
            '<div class="sim-info-row"><span>Reserva min.:</span> ' + ponto.reserva_minima_m3.toLocaleString('pt-BR') + ' m3</div>' +
            '<div class="sim-info-row"><span>Prioridade:</span> <strong>' + (LABELS_PRIORIDADE[ponto.prioridade] || ponto.prioridade) + '</strong></div>' +
            (ponto.dados_reais ? '<div class="sim-info-badge sim-badge-real">Dados reais</div>' : '<div class="sim-info-badge sim-badge-estimado">Estimado</div>');
    }

    function renderizarPontosGrid() {
        var grid = document.getElementById('sim-pontos-grid');
        if (!grid) return;

        var html = '';
        pontosAtuais.forEach(function(p) {
            var oc = ocupacao(p);
            var aut = formatarDias(autonomia(p));
            var crit = criticidade(p);
            var cor = CORES_CRITICIDADE[crit];
            var dadosTag = p.dados_reais
                ? '<span class="sim-badge-tag sim-tag-real">Real</span>'
                : '<span class="sim-badge-tag sim-tag-estimado">Estimado</span>';

            html += '<div class="sim-ponto-card" data-id="' + p.id + '">' +
                '<div class="sim-ponto-header">' +
                '<h4>' + p.nome + '</h4>' +
                dadosTag +
                '</div>' +
                '<div class="sim-ponto-barra">' +
                '<div class="sim-ponto-barra-fill" style="width:' + oc + '%;background:' + cor + ';"></div>' +
                '</div>' +
                '<div class="sim-ponto-stats">' +
                '<div><span>Vol:</span> ' + p.volume_atual_m3.toLocaleString('pt-BR') + ' / ' + p.capacidade_maxima_m3.toLocaleString('pt-BR') + ' m3</div>' +
                '<div><span>Aut:</span> <strong style="color:' + cor + '">' + aut + ' dias</strong></div>' +
                '<div><span>Priority:</span> ' + (LABELS_PRIORIDADE[p.prioridade] || p.prioridade) + '</div>' +
                '</div></div>';
        });
        grid.innerHTML = html;
    }

    function executarTransferencia() {
        var origemId = document.getElementById('sel-origem').value;
        var destinoId = document.getElementById('sel-destino').value;
        var volume = parseFloat(document.getElementById('input-volume').value) || 0;
        var perda = parseFloat(document.getElementById('input-perda').value) || 0;

        if (!origemId || !destinoId) return;
        if (origemId === destinoId) return;

        var origem = null, destino = null;
        for (var i = 0; i < pontosAtuais.length; i++) {
            if (pontosAtuais[i].id === origemId) origem = pontosAtuais[i];
            if (pontosAtuais[i].id === destinoId) destino = pontosAtuais[i];
        }
        if (!origem || !destino) return;

        var volumeDisponivel = Math.max(0, origem.volume_atual_m3 - origem.reserva_minima_m3);
        var espacoDestino = destino.capacidade_maxima_m3 - destino.volume_atual_m3;
        var volumeEfetivo = Math.min(volume, volumeDisponivel, Math.max(0, espacoDestino));
        volumeEfetivo = Math.max(0, volumeEfetivo);

        var volAntesOrigem = origem.volume_atual_m3;
        var volAntesDestino = destino.volume_atual_m3;
        var autAntesOrigem = autonomia(origem);
        var autAntesDestino = autonomia(destino);

        origem.volume_atual_m3 -= volumeEfetivo;
        var volumeRecebido = volumeEfetivo * (1 - perda / 100);
        destino.volume_atual_m3 = Math.min(destino.capacidade_maxima_m3, destino.volume_atual_m3 + volumeRecebido);

        var autDepoisOrigem = autonomia(origem);
        var autDepoisDestino = autonomia(destino);

        var resultado = {
            origem: { id: origem.id, nome: origem.nome, volumeAntes: volAntesOrigem, volumeDepois: origem.volume_atual_m3, autonomiaAntes: autAntesOrigem, autonomiaDepois: autDepoisOrigem, reservaMinima: origem.reserva_minima_m3, abaixoReserva: origem.volume_atual_m3 < origem.reserva_minima_m3 },
            destino: { id: destino.id, nome: destino.nome, volumeAntes: volAntesDestino, volumeDepois: destino.volume_atual_m3, autonomiaAntes: autAntesDestino, autonomiaDepois: autDepoisDestino, reservaMinima: destino.reserva_minima_m3, abaixoReserva: destino.volume_atual_m3 < destino.reserva_minima_m3 },
            volumeTransferido: volumeEfetivo, volumeRecebido: volumeRecebido, perdaPercentual: perda, perdaVolume: volumeEfetivo - volumeRecebido, viavel: volumeEfetivo > 0
        };

        var recomendacao = window.gerarRecomendacao(resultado);
        var score = window.calcularScoreCenario(resultado);

        renderizarResultado(resultado, score);
        renderizarRecomendacao(recomendacao);
        renderizarIndicadores();
        renderizarPontosGrid();

        if (typeof window.criarGraficoAntesDepois === 'function') {
            window.criarGraficoAntesDepois('grafico-antes-depois', resultado);
        }
        if (typeof window.criarGraficoAutonomia === 'function') {
            window.criarGraficoAutonomia('grafico-autonomia', pontosAtuais);
        }

        adicionarLog(origem.nome, destino.nome, volumeEfetivo, recomendacao.nivel);

        mostrarInfoPonto(origemId, 'info-origem');
        mostrarInfoPonto(destinoId, 'info-destino');
    }

    function renderizarResultado(resultado, score) {
        var container = document.getElementById('sim-resultado');
        if (!container) return;

        var origemCrit = resultado.origem.abaixoReserva ? 'style="color:#ef4444;font-weight:700"' : '';
        var destinoCrit = resultado.destino.abaixoReserva ? 'style="color:#ef4444;font-weight:700"' : '';

        container.innerHTML =
            '<table class="sim-result-table">' +
            '<thead><tr><th></th><th>Antes</th><th>Depois</th><th>Reserva Min.</th></tr></thead>' +
            '<tbody>' +
            '<tr><td><strong>' + resultado.origem.nome + '</strong></td>' +
            '<td>' + resultado.origem.volumeAntes.toLocaleString('pt-BR') + ' m3</td>' +
            '<td ' + origemCrit + '>' + resultado.origem.volumeDepois.toLocaleString('pt-BR') + ' m3</td>' +
            '<td>' + resultado.origem.reservaMinima.toLocaleString('pt-BR') + ' m3</td></tr>' +
            '<tr><td><strong>' + resultado.destino.nome + '</strong></td>' +
            '<td>' + resultado.destino.volumeAntes.toLocaleString('pt-BR') + ' m3</td>' +
            '<td ' + destinoCrit + '>' + resultado.destino.volumeDepois.toLocaleString('pt-BR') + ' m3</td>' +
            '<td>' + resultado.destino.reservaMinima.toLocaleString('pt-BR') + ' m3</td></tr>' +
            '</tbody></table>' +
            '<div class="sim-result-summary">' +
            '<div>Transferido: <strong>' + resultado.volumeTransferido.toFixed(0) + ' m3</strong></div>' +
            '<div>Recebido: <strong>' + resultado.volumeRecebido.toFixed(0) + ' m3</strong> (perda: ' + resultado.perdaVolume.toFixed(0) + ' m3)</div>' +
            '<div>Autonomia origem: ' + formatarDias(resultado.origem.autonomiaAntes) + ' → <strong>' + formatarDias(resultado.origem.autonomiaDepois) + ' dias</strong></div>' +
            '<div>Autonomia destino: ' + formatarDias(resultado.destino.autonomiaAntes) + ' → <strong>' + formatarDias(resultado.destino.autonomiaDepois) + ' dias</strong></div>' +
            '<div>Score do cenario: <strong>' + score + '/100</strong></div>' +
            '</div>';
    }

    function renderizarRecomendacao(rec) {
        var container = document.getElementById('sim-recomendacao');
        if (!container) return;

        var bordaCores = { viavel: '#16a34a', arriscado: '#f59e0b', perigoso: '#ef4444', indesejavel: '#6b7280' };
        var bgCores = { viavel: 'rgba(22,163,74,0.08)', arriscado: 'rgba(245,158,11,0.08)', perigoso: 'rgba(239,68,68,0.08)', indesejavel: 'rgba(107,114,128,0.08)' };
        var cor = bordaCores[rec.nivel] || '#6b7280';
        var bg = bgCores[rec.nivel] || 'transparent';

        var detalhesHtml = rec.detalhes.map(function(d) { return '<li>' + d + '</li>'; }).join('');

        container.innerHTML =
            '<div class="sim-rec-box" style="border-left:4px solid ' + cor + ';background:' + bg + ';">' +
            '<div class="sim-rec-nivel" style="color:' + cor + ';">' + rec.nivel.toUpperCase() + '</div>' +
            '<p class="sim-rec-texto">' + rec.texto + '</p>' +
            '<p class="sim-rec-score">Score: ' + rec.score + '/100</p>' +
            (detalhesHtml ? '<ul class="sim-rec-detalhes">' + detalhesHtml + '</ul>' : '') +
            '</div>';
    }

    function renderizarIndicadores() {
        var container = document.getElementById('sim-indicadores');
        if (!container) return;

        var totalVolume = 0, totalCapacidade = 0, criticos = 0, totalAutonomia = 0, countAutonomia = 0;

        pontosAtuais.forEach(function(p) {
            totalVolume += p.volume_atual_m3;
            totalCapacidade += p.capacidade_maxima_m3;
            if (criticidade(p) === 'critico') criticos++;
            if (p.consumo_medio_m3_dia > 0) {
                totalAutonomia += autonomia(p);
                countAutonomia++;
            }
        });

        var mediaAutonomia = countAutonomia > 0 ? (totalAutonomia / countAutonomia).toFixed(1) : 'N/A';
        var taxaMedia = totalCapacidade > 0 ? ((totalVolume / totalCapacidade) * 100).toFixed(1) : '0';

        container.innerHTML =
            '<div class="sim-ind-item"><span>Volume total</span><strong>' + totalVolume.toLocaleString('pt-BR') + ' m3</strong></div>' +
            '<div class="sim-ind-item"><span>Taxa media</span><strong>' + taxaMedia + '%</strong></div>' +
            '<div class="sim-ind-item"><span>Autonomia media</span><strong>' + mediaAutonomia + ' dias</strong></div>' +
            '<div class="sim-ind-item"><span>Pontos criticos</span><strong style="color:' + (criticos > 0 ? '#ef4444' : '#16a34a') + '">' + criticos + '</strong></div>';
    }

    function adicionarLog(origem, destino, volume, nivel) {
        var container = document.getElementById('sim-log');
        if (!container) return;

        var hora = new Date().toLocaleTimeString('pt-BR');
        sessionLog.unshift({ hora: hora, origem: origem, destino: destino, volume: volume, nivel: nivel });

        var corNivel = { viavel: '#16a34a', arriscado: '#f59e0b', perigoso: '#ef4444', indesejavel: '#6b7280' };
        var html = sessionLog.map(function(e) {
            return '<div class="sim-log-entry">' +
                '<span class="sim-log-hora">' + e.hora + '</span> ' +
                e.origem + ' → ' + e.destino + ': ' + e.volume.toFixed(0) + ' m3 ' +
                '<span style="color:' + (corNivel[e.nivel] || '#6b7280') + ';font-weight:600;">[' + e.nivel + ']</span>' +
                '</div>';
        }).join('');

        container.innerHTML = html || '<p class="sim-placeholder">Nenhuma acao registrada.</p>';
    }

    function resetar() {
        pontosAtuais = pontosOriginais.map(function(p) { return Object.assign({}, p); });
        sessionLog = [];

        renderizarPontosGrid();
        renderizarIndicadores();

        document.getElementById('sim-resultado').innerHTML = '<p class="sim-placeholder">Configure os parametros e execute uma transferencia para ver os resultados.</p>';
        document.getElementById('sim-recomendacao').innerHTML = '<p class="sim-placeholder">A recomendacao sera exibida apos configurar a transferencia.</p>';
        document.getElementById('sim-log').innerHTML = '<p class="sim-placeholder">Nenhuma acao registrada.</p>';
        document.getElementById('info-origem').innerHTML = '';
        document.getElementById('info-destino').innerHTML = '';
        document.getElementById('sel-origem').value = '';
        document.getElementById('sel-destino').value = '';

        if (typeof window.destruirGraficosSimulador === 'function') {
            window.destruirGraficosSimulador();
        }
    }

    function previewRecomendacao() {
        var origemId = document.getElementById('sel-origem').value;
        var destinoId = document.getElementById('sel-destino').value;
        if (!origemId || !destinoId || origemId === destinoId) return;

        var volume = parseFloat(document.getElementById('input-volume').value) || 0;
        var perda = parseFloat(document.getElementById('input-perda').value) || 0;

        var origem = null, destino = null;
        for (var i = 0; i < pontosAtuais.length; i++) {
            if (pontosAtuais[i].id === origemId) origem = pontosAtuais[i];
            if (pontosAtuais[i].id === destinoId) destino = pontosAtuais[i];
        }
        if (!origem || !destino) return;

        var volDisponivel = Math.max(0, origem.volume_atual_m3 - origem.reserva_minima_m3);
        var espaco = destino.capacidade_maxima_m3 - destino.volume_atual_m3;
        var volEfetivo = Math.min(volume, volDisponivel, Math.max(0, espaco));
        volEfetivo = Math.max(0, volEfetivo);

        var resultado = {
            origem: { volumeAntes: origem.volume_atual_m3, volumeDepois: origem.volume_atual_m3 - volEfetivo, autonomiaAntes: autonomia(origem), autonomiaDepois: origem.consumo_medio_m3_dia > 0 ? (origem.volume_atual_m3 - volEfetivo) / origem.consumo_medio_m3_dia : Infinity, reservaMinima: origem.reserva_minima_m3, abaixoReserva: (origem.volume_atual_m3 - volEfetivo) < origem.reserva_minima_m3 },
            destino: { volumeAntes: destino.volume_atual_m3, volumeDepois: Math.min(destino.capacidade_maxima_m3, destino.volume_atual_m3 + volEfetivo * (1 - perda / 100)), autonomiaAntes: autonomia(destino), autonomiaDepois: destino.consumo_medio_m3_dia > 0 ? Math.min(destino.capacidade_maxima_m3, destino.volume_atual_m3 + volEfetivo * (1 - perda / 100)) / destino.consumo_medio_m3_dia : Infinity, reservaMinima: destino.reserva_minima_m3, abaixoReserva: Math.min(destino.capacidade_maxima_m3, destino.volume_atual_m3 + volEfetivo * (1 - perda / 100)) < destino.reserva_minima_m3 },
            volumeTransferido: volEfetivo, volumeRecebido: volEfetivo * (1 - perda / 100), perdaPercentual: perda
        };

        renderizarRecomendacao(window.gerarRecomendacao(resultado));
    }

    document.addEventListener('DOMContentLoaded', function() {
        fetch('data/pontos-simulacao.json')
            .then(function(r) { return r.json(); })
            .then(function(dados) {
                pontosOriginais = dados.pontos;
                pontosAtuais = pontosOriginais.map(function(p) { return Object.assign({}, p); });

                popularSelects();
                renderizarPontosGrid();
                renderizarIndicadores();

                document.getElementById('sel-origem').addEventListener('change', function() {
                    mostrarInfoPonto(this.value, 'info-origem');
                    previewRecomendacao();
                });
                document.getElementById('sel-destino').addEventListener('change', function() {
                    mostrarInfoPonto(this.value, 'info-destino');
                    previewRecomendacao();
                });

                document.getElementById('input-volume').addEventListener('input', function() {
                    document.getElementById('output-volume').textContent = this.value + ' m3';
                    previewRecomendacao();
                });
                document.getElementById('input-perda').addEventListener('input', function() {
                    document.getElementById('output-perda').textContent = this.value + '%';
                    previewRecomendacao();
                });

                document.getElementById('btn-executar').addEventListener('click', executarTransferencia);
                document.getElementById('btn-resetar').addEventListener('click', resetar);
            })
            .catch(function(erro) {
                document.querySelector('.sim-central').innerHTML = '<p style="color:var(--cor-aproximado);">Erro ao carregar dados: ' + erro.message + '</p>';
            });
    });
})();
