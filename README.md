# Plataforma de Analise do Abastecimento Hidrico — Rio Verde, GO

Plataforma academica de analise e simulacao do sistema de abastecimento de agua do municipio de Rio Verde, Goias, Brasil. Desenvolvida como componente pratico do Trabalho de Conclusao de Curso (TCC).

## Sobre o Projeto

Este projeto apresenta uma analise do sistema de abastecimento hidrico de Rio Verde com base em dados oficiais de fontes publicas (Saneago, Camara Municipal, IBGE). A plataforma permite visualizar a infraestrutura existente, simular cenarios operacionais e consultar a proveniencia de cada dado apresentado.

### Principios

- **Rastreabilidade**: todo dado exibido possui proveniencia registrada e pode ser verificado na fonte original.
- **Transparencia**: dados sao classificados como confirmados, derivados ou nao verificados.
- **Abrangencia limitada**: o escopo e exclusivamente o municipio de Rio Verde, GO.
- **Seriedade academica**: a plataforma nao reivindica certeza operacional sobre dados estimados.

## Escopo Geografico

Municipio de Rio Verde, GO — populacao estimada de 241.494 habitantes (IBGE, estimativa 2025).

## Funcionalidades

### Mapa Interativo
- Visualizacao da infraestrutura de abastecimento no municipio
- Marcadores com classificacao de certeza (confirmado / estimado / nao verificado)
- Legenda de cores por nivel de operacao

### Simulacao de Cenarios
- Simulacao de eventos climaticos (seca, chuva intensa)
- Variacao de demanda (crescimento populacional, aumento industrial)
- Simulacao de interrupcoes operacionais
- Linha do tempo com estados simulados

### Previsao Estatistica
- Projecao de consumo baseada em medias moveis
- Sem dependencia de bibliotecas de aprendizado de maquina externas

### Graficos
- Producao versus demanda (barras agrupadas)
- Linha do tempo da simulacao

### Hidrologia
- Formulas de demanda, producao efetiva e indice de estresse hidrico
- Parametros adaptados ao bioma Cerrado

## Tecnologias

| Tecnologia | Versao | Uso |
|------------|--------|-----|
| JavaScript (ES6+) | — | Logica principal (vanilla) |
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

## Estrutura do Projeto

```
rio-verde-agua/
├── index.html                          # Pagina principal
├── css/
│   └── style.css                       # Estilos academicos
├── js/
│   ├── app.js                          # Orquestrador principal
│   ├── data.js                         # Carregador de dados JSON
│   ├── simulador.js                    # Motor de simulacao
│   ├── hidrologia.js                   # Formulas hidrologicas
│   ├── graficos.js                     # Bindings Chart.js
│   ├── mapa.js                         # Configuracao Leaflet
│   ├── redistribuicao.js               # Balanceamento interno
│   └── ia.js                           # Previsao estatistica
├── data/
│   ├── infraestrutura-rio-verde.json   # Dados de infraestrutura (10 itens)
│   └── fontes.json                     # Registro de fontes (4 entradas)
├── docs/
│   ├── DATA_PROVENANCE.md              # Proveniencia completa dos dados
│   ├── MARKER_AUDIT.md                 # Auditoria de marcadores do mapa
│   └── QA_REPORT.md                    # Relatorio de garantia de qualidade
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
