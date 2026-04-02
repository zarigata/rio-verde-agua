# Auditoria de Marcadores Geográficos

Este documento registra todos os marcadores geográficos exibidos no mapa interativo, sua procedência e o resultado da auditoria.

## Resultado da Auditoria

| Verificação | Resultado |
|-------------|----------|
| Marcadores restritos ao município de Rio Verde | Aprovado |
| Cada marcador possui proveniência registrada | Aprovado |
| Nenhum marcador inventado | Aprovado |
| Níveis de certeza declarados | Aprovado |
| Coordenadas não reivindicam precisão GPS | Aprovado |

---

## Marcadores Anteriores (Removidos)

Os seguintes marcadores foram **removidos** por estarem fora do escopo municipal de Rio Verde/GO:

| Cidade | Latitude | Longitude | Motivo da remoção |
|--------|----------|-----------|-------------------|
| Santa Helena de Goiás | -17.8122 | -50.9493 | Fora do município de Rio Verde |
| Jataí | -17.8817 | -51.7228 | Fora do município de Rio Verde |
| Montividiu | -17.4183 | -51.2478 | Fora do município de Rio Verde |
| Santo Antônio da Barra | -17.7583 | -50.4703 | Fora do município de Rio Verde |
| Castelândia | -17.6544 | -50.4975 | Fora do município de Rio Verde |

**Apenas Rio Verde (-17.7911, -50.9256) permaneceu no escopo.**

---

## Marcadores Atuais (10 itens)

### Infraestrutura Operacional

| ID | Nome | Tipo | Lat | Lng | Certeza | Status | Fonte |
|----|------|------|-----|-----|---------|--------|-------|
| `eta-abobora` | ETA Abóbora | Tratamento | -17.7806 | -50.9310 | Derivado | Operacional | Saneago 2023 |
| `cr-aeroporto` | CR Aeroporto | Reservação | -17.8333 | -50.9080 | Derivado | Operacional | Saneago 2023 |
| `cr-gameleiras` | CR Gameleiras | Reservação | -17.8040 | -50.9420 | Derivado | Em construção | Saneago 2023 |
| `ete-chapadinha` | ETE Chapadinha | Tratamento de Esgoto | -17.7930 | -50.9030 | Derivado | Operacional | Saneago 2023 |
| `fonte-ribeirao-abobora` | Ribeirão Abóbora | Manancial | -17.7800 | -50.9350 | Derivado | Operacional | Saneago 2023 |
| `fonte-ribeirao-laje` | Ribeirão da Laje | Manancial | -17.7850 | -50.9200 | Derivado | Operacional | Saneago 2023 |

### Infraestrutura em Construção (Sistema Rio Verdinho)

| ID | Nome | Tipo | Lat | Lng | Certeza | Status | Fonte |
|----|------|------|-----|-----|---------|--------|-------|
| `captacao-rio-verdinho` | Captação Rio Verdinho (Lote 1) | Captação | -17.8500 | -51.0000 | Aproximado | Em construção | Câmara 2024 |
| `eta-rio-verdinho` | ETA Rio Verdinho (Lote 2) | Tratamento | -17.8450 | -50.9800 | Aproximado | Em construção | Câmara 2024 |
| `adutoras-rio-verdinho-lote3a` | Adutoras e Reservatórios (Lote 3A) | Distribuição | -17.8200 | -50.9500 | Aproximado | Em construção | Câmara 2024 |
| `adutoras-rio-verdinho-lote3b` | Adutoras e Estação Elevatória (Lote 3B) | Distribuição | -17.8100 | -50.9200 | Aproximado | Em construção | Câmara 2024 |

---

## Distribuição por Tipo

| Tipo | Quantidade | Cor no mapa |
|------|-----------|-------------|
| Captação | 1 | Azul |
| Manancial | 2 | Azul |
| Tratamento | 2 | Verde |
| Reservação | 2 | Roxo |
| Tratamento de Esgoto | 1 | Laranja |
| Distribuição | 2 | Cinza |

## Distribuição por Nível de Certeza

| Nível | Quantidade | Descrição |
|-------|-----------|-----------|
| Confirmado | 0 | Nenhum ponto possui coordenada GPS confirmada |
| Derivado | 6 | Geocodificados a partir de bairros e cursos d'água |
| Aproximado | 4 | Ponto médio de trechos ou cursos d'água distantes |

## Distribuição por Status Operacional

| Status | Quantidade |
|--------|-----------|
| Operacional | 6 |
| Em construção | 4 |

---

## Limitações das Coordenadas

1. **Não há coordenadas oficiais públicas** para as instalações de água de Rio Verde. A Saneago e a Câmara Municipal não publicam as coordenadas GPS exatas das ETAs, reservatórios ou estações elevatórias.

2. **A geocodificação por nome de bairro** introduz imprecisão significativa. Bairros como "Gameleiras" ou "Chapadinha" podem abranger áreas de vários km².

3. **Cursos d'água são lineares**, não pontuais. Atribuir uma coordenada única ao Ribeirão Abóbora ou ao Rio Verdinho é uma simplificação necessária para visualização no mapa.

4. **O sistema Rio Verdinho está em construção**. Suas coordenadas são particularmente incertas porque a localização exata dos lotes 1, 2 e 3 pode não corresponder ao ponto médio estimado.

5. **Recomendação**: Para uso acadêmico ou profissional, substituir estas coordenadas por levantamento topográfico ou georreferenciamento de campo.
