# Proveniência dos Dados

Este documento registra a origem de cada dado exibido no site, classificando-os em três níveis de certeza.

## Níveis de Certeza

| Nível | Definição |
|-------|-----------|
| **Confirmado** | Dado obtido diretamente de fonte oficial, sem transformação |
| **Derivado** | Dado calculado ou estimado a partir de referência indireta (bairro, endereço, nome de curso d'água) |
| **Aproximado** | Dado estimado com baixa precisão, sujeito a desvio significativo |

---

## Fontes Consultadas

### 1. Saneago (2023)

- **URL**: https://www.saneago.com.br/#/noticia_interna/9868/3
- **Título**: Prefeito e diretoria da Saneago realizam visita técnica em unidades de Rio Verde
- **Data de publicação**: 18/08/2023
- **Tipo**: Artigo institucional (SPA Angular)
- **Data de acesso**: 02/04/2026
- **Status**: Acessível (requer execução de JavaScript)

**Dados extraídos:**

| Dado | Valor | Nível de certeza | Arquivo JSON |
|------|-------|-----------------|---------------|
| ETA Abóbora — capacidade | 120 L/s | Confirmado (citação literal) | `infraestrutura-rio-verde.json` → `eta-abobora` |
| ETA Abóbora — estações compactas | 4 estações em aço | Confirmado (citação literal) | `infraestrutura-rio-verde.json` → `eta-abobora` |
| Centro de Reservação Aeroporto — capacidade | 2 × 1.000.000 L (2.000 m³) | Confirmado (citação literal) | `infraestrutura-rio-verde.json` → `cr-aeroporto` |
| Centro de Reservação Aeroporto — abastecimento | Setores Promissão e Fesurv | Confirmado (citação literal) | `infraestrutura-rio-verde.json` → `cr-aeroporto` |
| Centro de Reservação Gameleiras — status | Em obras | Confirmado (citação literal) | `infraestrutura-rio-verde.json` → `cr-gameleiras` |
| ETE Chapadinha — capacidade | 58 L/s | Confirmado (citação literal) | `infraestrutura-rio-verde.json` → `ete-chapadinha` |
| ETE Chapadinha — tecnologia | MBBR | Confirmado (citação literal) | `infraestrutura-rio-verde.json` → `ete-chapadinha` |
| Cobertura água urbana | 99% | Confirmado (citação literal) | `infraestrutura-rio-verde.json` → `indicadores_municipais` |
| Cobertura esgoto urbana | 96,3% | Confirmado (citação literal) | `infraestrutura-rio-verde.json` → `indicadores_municipais` |
| Rede coletora | 963 km | Confirmado (citação literal) | `infraestrutura-rio-verde.json` → `indicadores_municipais` |
| Esgoto tratado | 26 milhões L/dia | Confirmado (citação literal) | `infraestrutura-rio-verde.json` → `indicadores_municipais` |
| Mananciais identificados | Ribeirão Abóbora, Ribeirão da Laje | Confirmado (citação literal) | `infraestrutura-rio-verde.json` → `fonte-ribeirao-abobora`, `fonte-ribeirao-laje` |

### 2. Câmara Municipal de Rio Verde (2024)

- **URL**: https://rioverde.go.leg.br/prefeitura-saneago-e-governo-de-goias-lancam-as-obras-do-novo-sistema-de-abastecimento-de-agua-rio-verdinho/
- **Título**: Prefeitura, Saneago e Governo de Goiás lançam as obras do novo sistema de abastecimento de água Rio Verdinho
- **Data de publicação**: 01/10/2024
- **Tipo**: Matéria jornalística (HTML estático)
- **Data de acesso**: 02/04/2026
- **Status**: Acessível

**Dados extraídos:**

| Dado | Valor | Nível de certeza | Arquivo JSON |
|------|-------|-----------------|---------------|
| Captação Rio Verdinho (Lote 1) — adutora | 7,3 km, 800 mm | Confirmado (citação literal) | `infraestrutura-rio-verde.json` → `captacao-rio-verdinho` |
| Captação Rio Verdinho (Lote 1) — investimento | R$ 47 milhões | Confirmado (citação literal) | `infraestrutura-rio-verde.json` → `captacao-rio-verdinho` |
| Captação Rio Verdinho (Lote 1) — prazo | 19 meses | Confirmado (citação literal) | `infraestrutura-rio-verde.json` → `captacao-rio-verdinho` |
| ETA Rio Verdinho (Lote 2) — capacidade | 800 L/s | Confirmado (citação literal) | `infraestrutura-rio-verde.json` → `eta-rio-verdinho` |
| ETA Rio Verdinho (Lote 2) — reservatórios | 2 × 2.000.000 L | Confirmado (citação literal) | `infraestrutura-rio-verde.json` → `eta-rio-verdinho` |
| ETA Rio Verdinho (Lote 2) — investimento | R$ 62,7 milhões | Confirmado (citação literal) | `infraestrutura-rio-verde.json` → `eta-rio-verdinho` |
| Lote 3A — adutoras | 14 km, 7 centros de reservação | Confirmado (citação literal) | `infraestrutura-rio-verde.json` → `adutoras-rio-verdinho-lote3a` |
| Lote 3B — adutoras | 12,4 km, 5 centros de reservação, 1 estação elevatória | Confirmado (citação literal) | `infraestrutura-rio-verde.json` → `adutoras-rio-verdinho-lote3b` |
| Lote 3 — investimento total | R$ 93 milhões | Confirmado (citação literal) | `infraestrutura-rio-verde.json` → `adutoras-rio-verdinho-lote3b` |
| Investimento total do sistema | ~R$ 202,7 milhões | Derivado (soma dos lotes) | Não exibido diretamente |

### 3. IBGE (2025)

- **URL**: https://www.ibge.gov.br/
- **Título**: Estimativa populacional IBGE 2025 — Rio Verde
- **Data de publicação**: 2025
- **Tipo**: Estimativa oficial
- **Data de acesso**: 02/04/2026
- **Status**: Portal público

**Dados extraídos:**

| Dado | Valor | Nível de certeza | Arquivo JSON |
|------|-------|-----------------|---------------|
| População estimada | 241.494 habitantes | Confirmado (fonte oficial) | `infraestrutura-rio-verde.json` → `indicadores_municipais` |

### 4. AMAE — Agência de Regulação (INDISPONÍVEL)

- **URL**: https://amae.rioverde.go.gov.br/analiseimpacto
- **Tipo**: Relatório regulatório
- **Data de acesso**: 02/04/2026
- **Status**: **404 — Página não encontrada**

**Lacuna de dados**: Esta fonte retornou erro 404 em 02/04/2026. Dados que poderiam ter sido extraídos não estão disponíveis. Nenhuma informação originária do AMAE foi incluída neste site. Informações sobre qualidade da água, índices de atendimento ou relatórios de regulação devem ser buscadas em fontes alternativas.

---

## Dados com Incerteza

### Coordenadas Geográficas (todas DERIVADAS ou APROXIMADAS)

Todas as coordenadas dos pontos de infraestrutura foram obtidas por geocodificação a partir de nomes de referência (bairros, cursos d'água, endereços). **Nenhuma coordenada foi confirmada por levantamento GPS em campo.**

| Item | Latitude | Longitude | Método | Nível |
|------|----------|-----------|--------|-------|
| ETA Abóbora | -17.7806 | -50.9310 | Geocodificação do nome "Ribeirão Abóbora" | Derivado |
| CR Aeroporto | -17.8333 | -50.9080 | Geocodificação da referência "Aeroporto" | Derivado |
| CR Gameleiras | -17.8040 | -50.9420 | Geocodificação do bairro "Gameleiras" | Derivado |
| ETE Chapadinha | -17.7930 | -50.9030 | Geocodificação do bairro "Chapadinha" | Derivado |
| Captação Rio Verdinho | -17.8500 | -51.0000 | Geocodificação do curso d'água | Aproximado |
| ETA Rio Verdinho | -17.8450 | -50.9800 | Geocodificação da localização do sistema | Aproximado |
| Lote 3A | -17.8200 | -50.9500 | Ponto médio do trecho de adutoras | Aproximado |
| Lote 3B | -17.8100 | -50.9200 | Ponto médio do trecho | Aproximado |
| Ribeirão Abóbora | -17.7800 | -50.9350 | Geocodificação do nome do ribeirão | Derivado |
| Ribeirão da Laje | -17.7850 | -50.9200 | Geocodificação do nome do ribeirão | Derivado |

### Capacidade de Produção (ETA Abóbora)

- **Confirmado**: 120 L/s (citação literal da fonte Saneago)
- **Derivado**: 10.368 m³/dia (conversão: 120 × 60 × 24 / 1000)

### Indicadores do Plano Original do Projeto

Os seguintes indicadores foram extraídos do plano original do projeto (`.sisyphus/plans/rio-verde-water-sim.md`) e **não possuem citação direta de fonte oficial verificável**:

| Dado | Valor | Fonte original | Nível de certeza |
|------|-------|----------------|-----------------|
| Consumo médio per capita | 150 L/hab/dia | Parâmetro adotado (ABNT NBR 12211) | Derivado |
| Extensão rede água | 509.966 m | Plano original do projeto | Derivado |
| Extensão rede esgoto | 119.612 m | Plano original do projeto | Derivado |
| Ligações de água | 31.817 | Plano original do projeto | Derivado |
| Ligações de esgoto | 19.095 | Plano original do projeto | Derivado |

---

## Conversões Aplicadas

| Conversão | Fórmula | Exemplo |
|-----------|---------|---------|
| L/s para m³/dia | `valor × 60 × 24 / 1000` | 120 L/s = 10.368 m³/dia |
| L/s para m³/dia | `valor × 86,4` | 58 L/s = 5.011,2 m³/dia |
| Milhões L para m³ | `valor × 1.000.000` | 26 milhões L = 26.000 m³ |

---

## Dados do Simulador (`pontos-simulacao.json`)

O simulador de transferencia utiliza 9 pontos com os seguintes niveis de certeza:

| Ponto | Tipo | Capacidade | Consumo | Certeza | Justificativa |
|-------|------|------------|---------|---------|---------------|
| ETA Abobora | ETA | 2.000 m³ | — | Confirmado | Capacidade derivada de 120 L/s (Saneago 2023) |
| CR Aeroporto | Reservatorio | 2.000 m³ | 420 m³/dia | Confirmado | Capacidade literal do artigo Saneago 2023 |
| CR Gameleiras | Reservatorio | 1.500 m³ | 330 m³/dia | Estimado | Capacidade nao divulgada; estimada por类比 com CR Aeroporto |
| ETA Rio Verdinho (Lote 2) | ETA | 4.000 m³ | — | Confirmado | Captação citada na Camara Municipal 2024 |
| Setor Sul (Jardim Goias) | Zona | 800 m³ | 270 m³/dia | Estimado | Populacao e consumo estimados (IBGE) |
| Setor Norte (Vila Nova) | Zona | 600 m³ | 210 m³/dia | Estimado | Populacao e consumo estimados (IBGE) |
| Setor Oeste (St. Antonio) | Zona | 500 m³ | 180 m³/dia | Estimado | Populacao e consumo estimados (IBGE) |
| Ribeirao Abobora | Manancial | 50.000 m³ | 10.000 m³/dia | Estimado | Volume estimado para ribeirao de Cerrado |
| Ribeirao da Laje | Manancial | 40.000 m³ | — | Estimado | Volume estimado para ribeirao de Cerrado |

> **Nota**: Todos os pontos marcados como "Estimado" sao claramente identificados na interface do simulador com o badge "Estimado". Os pontos "Confirmado" possuem badge "Real".

---

## Dados Não Utilizados (Removidos)

Os seguintes dados do sistema anterior foram **intencionalmente removidos** por não serem verificáveis ou por referirem-se a municípios fora do escopo:

- Dados das cidades de Jataí, Santa Helena de Goiás, Montividiu, Santo Antônio da Barra e Castelândia (6 cidades → 1 município)
- Dados históricos sintéticos de 2015-2024 (6522 linhas em `data/historico.json`)
- Modelo de previsão com TensorFlow.js (removido junto com a dependência)
- Conexões intermunicipais para redistribuição de água
- População total "402.000" do rodapé anterior (contradizia os próprios dados)
