import { carregarDados } from './data.js';
import { inicializarMapa, renderizarInfraestrutura } from './mapa.js';

document.addEventListener('DOMContentLoaded', async function() {
    try {
        var dados = await carregarDados();
        inicializarMapa('mapa');
        renderizarInfraestrutura(dados.infraestrutura);
    } catch (erro) {
        var container = document.querySelector('.conteudo');
        if (container) {
            container.innerHTML = '<p style="color:var(--cor-aproximado);">Erro ao carregar dados: ' + erro.message + '</p>';
        }
    }
});
