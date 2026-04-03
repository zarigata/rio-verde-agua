# Plataforma de Analise do Abastecimento Hidrico — Rio Verde, GO

Plataforma academica multi-pagina de analise e simulacao do sistema de abastecimento de agua do municipio de Rio Verde, Goias, Brasil. Desenvolvida como componente pratico do Trabalho de Conclusao de Curso (TCC).

## Sobre o Projeto

Este projeto apresenta uma analise do sistema de abastecimento hidrico de Rio Verde com base em dados oficiais de fontes publicas (Saneago, Camara Municipal, IBGE). A plataforma permite visualizar a infraestrutura existente, simular transferencias entre pontos de abastecimento, simular cenarios climaticos e consultar a proveniencia de cada dado apresentado.

### Principios

- **Rastreabilidade**: todo dado exibido possui proveniencia registrada e pode ser verificado na fonte original.
- **Transparencia**: dados sao classificados como confirmados, derivados ou nao verificados.
- **Abrangencia limitada**: o escopo e exclusivamente o municipio de Rio Verde, GO.
- **Seriedade academica**: a plataforma nao reivindica certeza operacional sobre dados estimados.

## Escopo Geografico

Municipio de Rio Verde, GO — populacao estimada de 241.494 habitantes (IBGE, estimativa 2025).

## Paginas

| Pagina | Arquivo | Descricao |
|--------|---------|-----------|
| Visao Geral | `index.html` | Apresentacao institucional do TCC, problema, como funciona |
| Metodologia | `metodologia.html` | Objetivos, formulas, classificacao de dados, limitacoes |
| Dados Reais | `dados.html` | Infraestrutura, indicadores, fontes com tabela interativa |
| Mapa | `mapa.html` | Mapa interativo Leaflet com marcadores classificados |
| Simulador | `simulador.html` | Simulador de transferencia hidrica com recomendacoes |
| Cenarios | `cenarios.html` | Simulacao de eventos climaticos e operacionais |
| Equipe / Projeto | `equipe.html` | Tecnologias, documentacao, referencias bibliograficas |

Todas as paginas compartilham navegacao, tema claro/escuro (persistido em localStorage) e design academico consistente.

## Funcionalidades

### Simulador de Transferencia Hidrica
- Selecao de 9 pontos de abastecimento (ETAs, reservatorios, zonas, mananciais)
- Ajuste de volume, perda operacional e horizonte temporal
- Calculo em tempo real de viabilidade, autonomia e score do cenario
- Motor de recomendacao com 4 niveis (viavel, arriscado, perigoso, indesejavel)
- Graficos comparativos antes/depois e autonomia estimada
- Log de sessao com historico de transferencias

### Simulacao de Cenarios
- Eventos climaticos (seca, chuva intensa)
- Variacao de demanda (crescimento populacional, aumento industrial)
- Linha do tempo com estados simulados

### Mapa Interativo
- Visualizacao da infraestrutura de abastecimento no municipio
- Marcadores com classificacao de certeza (confirmado / estimado / nao verificado)
- Legenda de cores por nivel de operacao

### Hidrologia
- Formulas de demanda, producao efetiva, indice de estresse hidrico
- Calculo de ocupacao percentual, autonomia e criticidade
- Parametros adaptados ao bioma Cerrado

## Tecnologias

| Tecnologia | Versao | Uso |
|------------|--------|-----|
| JavaScript (ES6+, modules) | — | Logica principal (vanilla, sem build) |
| Leaflet | 1.9.4 | Mapas interativos |
| Chart.js | 4.x | Visualizacoes graficas |
| GitHub Pages | — | Hospedagem estatica |

Nao ha dependencias de build. O projeto e inteiramente estatico.

## Acesso

**Site em producao**: https://zarigata.github.io/rio-verde-agua/

### Execucao Local

```bash
git clone https://github.com/zarigata/rio-verde-agua.git
cd rio-verde-agua
python3 -m http.server 8080
# Acesse http://localhost:8080
```

> **Nota**: servidor HTTP necessario porque os scripts usam `type="module"`, que requer CORS. Abrir `index.html` diretamente no navegador (protocolo `file://`) nao funciona.

## Estrutura do Projeto

```
rio-verde-agua/
├── index.html                          # Visao Geral
├── metodologia.html                    # Metodologia
├── dados.html                          # Dados Reais
├── mapa.html                           # Mapa interativo
├── simulador.html                      # Simulador de transferencia
├── cenarios.html                       # Simulacao de cenarios
├── equipe.html                         # Equipe / Projeto
├── css/
│   ├── style.css                       # Design system base + dark mode
│   ├── visao-geral.css                 # Estilos da pagina institucional
│   └── simulador.css                   # Estilos do simulador e cenarios
├── js/
│   ├── theme.js                        # Toggle claro/escuro
│   ├── data.js                         # Carregador de dados JSON (ES module)
│   ├── simulador.js                    # Motor de simulacao + transferencia
│   ├── hidrologia.js                   # Formulas hidrologicas
│   ├── ia.js                           # Motor de recomendacao + previsao
│   ├── redistribuicao.js               # Viabilidade de transferencias
│   ├── graficos.js                     # Bindings Chart.js
│   ├── mapa.js                         # Configuracao Leaflet
│   ├── simulador-page.js               # Controlador do simulador (IIFE)
│   ├── cenarios-page.js                # Controlador de cenarios (IIFE)
│   ├── dados-page.js                   # Controlador de dados (ES module)
│   └── mapa-page.js                    # Controlador do mapa (ES module)
├── data/
│   ├── infraestrutura-rio-verde.json   # Dados de infraestrutura (10 itens)
│   ├── pontos-simulacao.json          # 9 pontos + 7 conexoes + parametros
│   └── fontes.json                     # Registro de fontes (4 entradas)
├── docs/
│   ├── DATA_PROVENANCE.md              # Proveniencia completa dos dados
│   ├── MARKER_AUDIT.md                 # Auditoria de marcadores do mapa
│   └── QA_REPORT.md                    # Relatorio de garantia de qualidade
├── LICENSE
└── README.md
```

## Fontes de Dados

| Fonte | Dados Utilizados | Data de Referencia |
|-------|-----------------|-------------------|
| Saneago (site oficial) | Capacidades de ETAs, reservatorios, ETE, indicadores operacionais | Ago/2023 |
| Camara Municipal de Rio Verde (Diario Oficial) | Obras do Sistema Rio Verdinho (Lotes 1, 2 e 3) | Out/2024 |
| IBGE | Populacao estimada do municipio | 2025 |

Para a proveniencia completa de cada ponto de dado, consulte [docs/DATA_PROVENANCE.md](docs/DATA_PROVENANCE.md).

## Documentacao

- [docs/DATA_PROVENANCE.md](docs/DATA_PROVENANCE.md) — Proveniencia de todos os dados utilizados, niveis de certeza, auditoria de coordenadas e conversoes realizadas.
- [docs/MARKER_AUDIT.md](docs/MARKER_AUDIT.md) — Auditoria de todos os marcadores atuais e removidos do mapa, com justificativas.
- [docs/QA_REPORT.md](docs/QA_REPORT.md) — Relatorio de testes funcionais, verificacao de contrato de IDs e estado do site em producao.

## Licenca

Este projeto esta sob a licenca MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Autor

Trabalho de Conclusao de Curso — Gestao de Recursos Hidricos
