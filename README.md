# 💧 Plataforma de Gestão Hídrica Urbana

Sistema inteligente de simulação e gerenciamento de abastecimento de água para a região de Rio Verde, Goiás, Brasil.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Active-brightgreen.svg)
![Language](https://img.shields.io/badge/idioma-Portugu%C3%AAs%20BR-green.svg)

## 📋 Sobre o Projeto

Este projeto é um **Trabalho de Conclusão de Curso (TCC)** que simula o gerenciamento inteligente de recursos hídricos urbanos utilizando dados municipais reais. O sistema permite simular eventos climáticos, crescimento populacional e redistribuição de água entre cidades vizinhas.

### 🎯 Objetivos

- Simular cenários de demanda e oferta de água em tempo real
- Aplicar técnicas de Inteligência Artificial para previsão de consumo
- Demonstrar algoritmos de redistribuição hídrica entre municípios
- Visualizar dados hidrológicos de forma interativa

## 🗺️ Região Abrangida

| Cidade | População | Produção (m³/dia) |
|--------|-----------|-------------------|
| Rio Verde | 241.494 | 48.000 |
| Jataí | 107.000 | 22.000 |
| Santa Helena de Goiás | 43.000 | 10.000 |
| Montividiu | 12.000 | 3.500 |
| Santo Antônio da Barra | 7.000 | 2.000 |
| Castelândia | 5.000 | 1.500 |

**Fonte**: IBGE (Estimativa 2025) e INMET (Normal Climatológica 1991-2020)

## ✨ Funcionalidades

### 🗺️ Mapa Interativo
- Visualização geográfica das 6 cidades
- Marcadores com nível atual dos reservatórios
- Código de cores: 🟢 Normal | 🟡 Pressão | 🔴 Crítico

### ⚡ Simulação de Eventos
- **🏜️ Seca**: Reduz produção em 40%
- **🌧️ Chuva Intensa**: Aumenta produção em 40%
- **📈 Crescimento Populacional**: +2% na demanda
- **🏭 Aumento Industrial**: +15% na demanda
- **💥 Quebra de Reservatório**: Perda de 30% da reserva
- **🚫 Cidade sem Água**: Zera produção

### 🤖 Inteligência Artificial
- Modelo TensorFlow.js para previsão de demanda
- Treinamento com 10 anos de dados históricos (2015-2024)
- Previsão de consumo baseada em padrões sazonais

### 🔄 Redistribuição Automática
- Algoritmo de balanceamento entre cidades
- Transferência de excedentes para déficits
- Respeita capacidade máxima de tubulação

### 📊 Gráficos Dinâmicos
- Demanda vs Produção ao longo do tempo
- Nível dos reservatórios
- Previsão da IA com intervalo de confiança

### 📐 Fórmulas Científicas
- **Demanda**: `D = População × Consumo_per_capita × Fator_estacional`
- **Produção Efetiva**: `P_ef = P_bruta × (1 - Perdas)`
- **Índice de Estresse Hídrico**: `IEH = Demanda / Disponibilidade`

## 🛠️ Tecnologias

| Tecnologia | Uso |
|------------|-----|
| ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow) | Lógica principal (Vanilla) |
| ![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-green) | Mapas interativos |
| ![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.10-orange) | IA no navegador |
| ![Chart.js](https://img.shields.io/badge/Chart.js-Latest-blue) | Visualizações |
| ![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Static-purple) | Hospedagem |

## 🚀 Como Usar

### Acesso Online
Acesse diretamente pelo GitHub Pages:
```
https://undertempo.github.io/rio-verde-agua/
```

### Execução Local

```bash
# Clone o repositório
git clone https://github.com/undertempo/rio-verde-agua.git
cd rio-verde-agua

# Inicie um servidor local (qualquer um destes)
python3 -m http.server 8080
# ou
npx serve
# ou
php -S localhost:8080

# Acesse http://localhost:8080
```

## 📁 Estrutura do Projeto

```
rio-verde-agua/
├── index.html              # Página principal
├── css/
│   └── style.css           # Estilos do dashboard
├── js/
│   ├── app.js              # Orquestrador principal
│   ├── simulador.js        # Motor de simulação
│   ├── hidrologia.js       # Fórmulas hidrológicas
│   ├── graficos.js         # Bindings Chart.js
│   ├── mapa.js             # Configuração Leaflet
│   ├── redistribuicao.js   # Algoritmo de balanceamento
│   └── ia.js               # Modelo TensorFlow.js
├── data/
│   ├── cidades.json        # Dados das cidades
│   └── historico.json      # 10 anos de dados (2015-2024)
└── README.md
```

## 📊 Dados

### Fontes Oficiais
- **População**: [IBGE - Estimativas 2025](https://www.ibge.gov.br/)
- **Clima**: [INMET - Normais Climatológicas](https://portal.inmet.gov.br/)
- **Coordenadas**: OpenStreetMap

### Histórico Disponível
- **Período**: Janeiro 2015 - Dezembro 2024
- **Registros**: 720 (10 anos × 12 meses × 6 cidades)
- **Variáveis**: Consumo, produção, precipitação, temperatura

## 🔬 Metodologia Científica

### Cálculo de Demanda
```
Demanda (m³/mês) = População × Consumo_per_capita (L/hab/dia) × Dias × Fator_estacional / 1000
```

### Fatores Sazonais (Cerrado Brasileiro)
| Estação | Meses | Fator Consumo | Chuva (mm/mês) |
|---------|-------|---------------|----------------|
| Verão | Dez-Fev | 1.15 | 200-300 |
| Outono | Mar-Mai | 1.05 | 150→30 |
| Inverno | Jun-Ago | 0.95 | 5-30 |
| Primavera | Set-Nov | 1.00 | 80→200 |

### Índice de Estresse Hídrico (IEH)
- **IEH < 0.1**: Sem estresse
- **0.1 ≤ IEH < 0.2**: Baixo
- **0.2 ≤ IEH < 0.4**: Moderado
- **IEH ≥ 0.4**: Alto

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍🎓 Autor

Trabalho de Conclusão de Curso - Gestão de Recursos Hídricos

---

**Nota**: Este é um projeto acadêmico de simulação. Os dados e cenários são fictícios baseados em parâmetros reais para fins educacionais.
