(function() {
    var nomesEventos = {
        seca: 'Seca',
        chuva_intensa: 'Chuva Intensa',
        crescimento_populacional: 'Crescimento Populacional',
        aumento_industrial: 'Aumento Industrial',
        quebra_reservatorio: 'Quebra de Reservatorio'
    };

    document.addEventListener('DOMContentLoaded', function() {
        if (typeof window.inicializarSimulacao !== 'function') return;
        if (typeof window.inscrever !== 'function') return;

        window.inicializarSimulacao();

        window.inscrever(function(estado) {
            if (typeof window.atualizarGraficoSimulacao === 'function') {
                window.atualizarGraficoSimulacao(estado);
            }
            if (typeof window.atualizarGraficoProducaoDemanda === 'function') {
                window.atualizarGraficoProducaoDemanda(estado);
            }
            atualizarStatus(estado);
        });

        if (typeof window.inicializarGraficos === 'function') {
            window.inicializarGraficos();
        }

        document.getElementById('btn-seca').addEventListener('click', function() {
            if (typeof window.simularEvento === 'function') window.simularEvento('seca');
        });
        document.getElementById('btn-chuva').addEventListener('click', function() {
            if (typeof window.simularEvento === 'function') window.simularEvento('chuva_intensa');
        });
        document.getElementById('btn-crescimento').addEventListener('click', function() {
            if (typeof window.simularEvento === 'function') window.simularEvento('crescimento_populacional');
        });
        document.getElementById('btn-industrial').addEventListener('click', function() {
            if (typeof window.simularEvento === 'function') window.simularEvento('aumento_industrial');
        });
        document.getElementById('btn-quebra').addEventListener('click', function() {
            if (typeof window.simularEvento === 'function') window.simularEvento('quebra_reservatorio');
        });

        document.getElementById('btn-avancar-dia').addEventListener('click', function() {
            if (typeof window.avancarTempo === 'function') window.avancarTempo(1);
        });
        document.getElementById('btn-avancar-mes').addEventListener('click', function() {
            if (typeof window.avancarTempo === 'function') window.avancarTempo(30);
        });
        document.getElementById('btn-avancar-ano').addEventListener('click', function() {
            if (typeof window.avancarTempo === 'function') window.avancarTempo(365);
        });

        document.getElementById('btn-reiniciar').addEventListener('click', function() {
            if (typeof window.reiniciarSimulacao === 'function') window.reiniciarSimulacao();
            var listaEl = document.getElementById('lista-eventos');
            if (listaEl) listaEl.innerHTML = '<p class="evento-vazio">Nenhum evento registrado</p>';
        });
    });

    function atualizarStatus(estado) {
        var el = document.getElementById('simulacao-status');
        if (el) {
            el.innerHTML =
                '<strong>' + estado.municipio + '</strong> — Dia ' + estado.tempoSimulacao + '<br>' +
                'Populacao: ' + estado.populacao.toLocaleString('pt-BR') + ' hab | ' +
                'Demanda: ' + Math.round(estado.demandaAtual).toLocaleString('pt-BR') + ' m3/dia | ' +
                'Producao: ' + Math.round(estado.producaoEfetiva).toLocaleString('pt-BR') + ' m3/dia | ' +
                'Reservatorio: ' + Math.round(estado.nivelReservatorio).toLocaleString('pt-BR') + ' m3';
        }

        var listaEl = document.getElementById('lista-eventos');
        if (listaEl && estado.historicoEventos) {
            var eventos = estado.historicoEventos.slice(-10).reverse();
            if (eventos.length === 0) {
                listaEl.innerHTML = '<p class="evento-vazio">Nenhum evento registrado</p>';
            } else {
                listaEl.innerHTML = eventos.map(function(e) {
                    return '<div class="sim-log-entry"><strong>Dia ' + e.dia + ':</strong> ' + (nomesEventos[e.evento] || e.evento) + '</div>';
                }).join('');
            }
        }
    }
})();
