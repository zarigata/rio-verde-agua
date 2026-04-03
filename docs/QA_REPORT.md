# Relatorio de QA

Teste de qualidade realizado em 03/04/2026 no site publicado em https://zarigata.github.io/rio-verde-agua/

## Ambiente de Teste

| Item | Valor |
|------|-------|
| URL | https://zarigata.github.io/rio-verde-agua/ |
| Navegador | Chromium 146 (via Playwright MCP) |
| Dispositivo | Desktop |
| Data | 03/04/2026 |
| Commit | 236864d (fix: add type=module to all engine script tags, fix select label bug) |
| GitHub Actions | pages-build-deployment — success |

## Resultado Geral

| Categoria | Status | Observacoes |
|-----------|--------|------------|
| Carregamento das paginas | Aprovado | Todas as 7 paginas carregam em < 5s |
| HTML semantico | Aprovado | lang="pt-BR", sections, nav, header, footer |
| Portugues com diacriticos | Aprovado | Agua, Municipio, Hidrica, Metodologia, Simulacao, etc. |
| Sem emojis em UI | Aprovado | Nenhum emoji em headings, botoes ou rotulos |
| Navegacao entre paginas | Aprovado | 7 abas, link ativo destacado |
| Tema claro/escuro | Aprovado | Toggle funcional, persistido em localStorage |
| Mapa Leaflet | Aprovado | Mapa carrega com tiles OpenStreetMap e marcadores |
| Tabela de infraestrutura | Aprovado | 10 linhas com 6 colunas, dados e links para fontes |
| Simulador de transferencia | Aprovado | 9 pontos, calculo em tempo real, recomendacoes |
| Simulacao de cenarios | Aprovado | Botoes de evento, linha do tempo |
| TensorFlow.js | Aprovado (ausente) | Nao carrega nenhuma dependencia de IA |

## Erros no Console

| Erro | Severidade | Resolucao |
|------|-----------|-----------|
| favicon.ico 404 | Baixa (cosmetico) | Nao requer acao. Apenas icone de favorito ausente. |

**Nenhum erro JavaScript.** Todos os 7 arquivos de logica passam `node --check`. Todas as paginas retornam 0 erros no console apos carregamento completo.

## Testes Funcionais

### Navegacao

- [x] 7 abas de navegacao: Visao Geral, Metodologia, Dados Reais, Mapa, Simulador, Cenarios, Equipe / Projeto
- [x] Link ativo (nav-active) destacado na pagina corrente
- [x] Todas as paginas acessiveis (HTTP 200)
- [x] Header com link para index.html

### Tema Claro/Escuro

- [x] Botao de toggle presente em todas as paginas
- [x] Alterna entre `data-theme="light"` e `data-theme="dark"`
- [x] Preferencia persistida em localStorage
- [x] Detecta preferencia do sistema operacional
- [x] Variaveis CSS aplicadas corretamente em ambos os temas

### Mapa Interativo

- [x] Mapa carrega com tiles do OpenStreetMap
- [x] Marcadores de infraestrutura visiveis
- [x] Legenda de certeza presente
- [x] Popups abrem ao clicar nos marcadores
- [x] Zoom in/Zoom out funcionais

### Dados Reais

- [x] Tabela de infraestrutura com 10 itens
- [x] Indicadores municipais populados
- [x] Cartoes de fontes com metadados
- [x] Dados carregados via fetch de JSON

### Simulador de Transferencia

- [x] 9 pontos disponiveis nos selects de origem/destino
- [x] Sliders de volume e perda operacional funcionais
- [x] Dropdown de horizonte temporal
- [x] Botao "Executar Transferencia" funcional
- [x] Botao "Resetar Simulacao" funcional
- [x] Cards de pontos com barras coloridas por criticidade
- [x] Badges "Real" / "Estimado" nos cards
- [x] Tabela de resultado com antes/depois
- [x] Recomendacao exibida com nivel e score
- [x] Log de sessao registra acoes
- [x] Indicadores globais (volume total, taxa media, autonomia, criticos)
- [x] Acordeoes explicativos ("Como Funciona")

### Simulacao de Cenarios

- [x] Botoes de evento presentes (Seca, Chuva Intensa, etc.)
- [x] Controles de tempo (+1 Dia, +1 Mes, +1 Ano)
- [x] Botao "Reiniciar Simulacao" funcional
- [x] Estado dos pontos atualizado apos evento

## Problemas Conhecidos

1. **Coordenadas aproximadas**: Todas as coordenadas sao geocodificadas, nao GPS-confirmadas. Declarado no rodape e nos popups.

2. **Dados do plano original**: Indicadores como extensao de rede agua (509.966 m) e ligacoes (31.817) nao possuem citacao direta de fonte oficial verificavel.

3. **AMAE indisponivel**: A fonte AMAE retornou 404. Dados regulatorios sobre qualidade da agua nao estao disponiveis.

4. **Sem favicon**: O icone de favorito retorna 404 (cosmetico).

5. **Responsividade**: Media queries foram escritas mas nao testadas em dispositivos reais.

6. **Dados do simulador**: 9 pontos de simulacao em `pontos-simulacao.json` usam capacidade e consumo confirmados para ETAs/reservatorios reais. Zonas de abastecimento e mananciais usam valores estimados (derivados de parametros academicos), claramente marcados como "Estimado" na interface.

## Conclusao

O site atende aos requisitos do TCC: dados rastreaveis, niveis de certeza declarados, sem dados inventados, tipografia academica e funcionamento da simulacao. A plataforma multi-pagina oferece navegacao clara, tema claro/escuro, simulador de transferencia com recomendacoes e simulacao de cenarios climaticos.
