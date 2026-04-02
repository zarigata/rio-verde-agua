# Relatório de QA

Teste de qualidade realizado em 02/04/2026 no site publicado em https://zarigata.github.io/rio-verde-agua/

## Ambiente de Teste

| Item | Valor |
|------|-------|
| URL | https://zarigata.github.io/rio-verde-agua/ |
| Navegador | Chromium (via Chrome DevTools MCP) |
| Dispositivo | Desktop |
| Data | 02/04/2026 |
| Commit | 74d06b5 (fix: repair broken JSON in data files) |
| GitHub Actions | pages-build-deployment — success (45s) |

## Resultado Geral

| Categoria | Status | Observações |
|-----------|--------|------------|
| Carregamento da página | Aprovado | Página carrega em < 5s |
| HTML semântico | Aprovado | lang="pt-BR", sections, nav, header, footer |
| Português com diacríticos | Aprovado | Água, Município, Hídrica, Metodologia, Simulação, etc. |
| Sem emojis em UI | Aprovado | Nenhum emoji em headings, botões ou rótulos |
| Mapa Leaflet | Aprovado | Mapa carrega com tiles OpenStreetMap e 10 marcadores |
| Tabela de infraestrutura | Aprovado | 10 linhas com 6 colunas, dados e links para fontes |
| Indicadores municipais | Aprovado | 10 indicadores com valores e fonte |
| Cartões de fontes | Aprovado | 4 fontes com metadados completos |
| Gráfico de produção/demanda | Aprovado | Chart.js bar chart renderizado |
| Gráfico de simulação | Aprovado | Chart.js line chart renderizado |
| Botões de simulação | Aprovado | 5 botões de evento + 3 de tempo + 1 reiniciar |
| Seção de referências | Aprovado | 5 referências em formato ABNT |
| Disclaimer de coordenadas | Aprovado | Presente no rodapé |
| TensorFlow.js | Aprovado (removido) | Não carrega nenhuma dependência de IA |

## Erros no Console

| Erro | Severidade | Resolução |
|------|-----------|-----------|
| favicon.ico 404 | Baixa (cosmético) | Não requer ação. Apenas ícone de favorito ausente. |

**Nenhum erro JavaScript.** O erro de parse de JSON que existiu no primeiro deploy foi corrigido no commit 74d06b5.

## Testes Funcionais

### Mapa Interativo

- [x] Mapa carrega com tiles do OpenStreetMap
- [x] 10 marcadores de infraestrutura visíveis
- [x] Legenda de certeza (Confirmado/Derivado/Aproximado) presente
- [x] Popups abrem ao clicar nos marcadores
- [x] Zoom in/Zoom out funcionais
- [x] Mapa centralizado em Rio Verde, zoom 12

### Tabela de Infraestrutura

- [x] Cabeçalho com 6 colunas: Nome, Tipo, Capacidade, Certeza, Status, Fonte
- [x] 10 linhas de dados (todas as infraestruturas)
- [x] Badges de certeza coloridos (verde/amarelo/vermelho)
- [x] Links para fontes oficiais abrem em nova aba
- [x] Items "Em construção" corretamente identificados
- [x] Endereços aproximados exibidos sob o nome

### Indicadores Municipais

- [x] Tabela com 3 colunas: Indicador, Valor, Fonte
- [x] 10 indicadores populados
- [x] Valores formatados (locale pt-BR para números)
- [x] Fonte atribuída a cada indicador

### Cartões de Fontes

- [x] 4 fontes exibidas como cartões com borda lateral
- [x] Metadados completos: autor, tipo, data, URL, status de acesso
- [x] Dados extraídos listados para cada fonte
- [x] Fonte AMAE-404 exibida com aviso de lacuna de dados

### Simulação

- [x] Botão "Seca" presente e funcional
- [x] Botão "Chuva Intensa" presente e funcional
- [x] Botão "Crescimento Populacional" presente e funcional
- [x] Botão "Aumento Industrial" presente e funcional
- [x] Botão "Quebra de Reservatório" presente e funcional
- [x] Controles de tempo (+1 Dia, +1 Mês, +1 Ano) presentes
- [x] Botão "Reiniciar Simulação" presente
- [x] Status da simulação exibe dados atualizados após evento
- [x] Histórico de eventos registra ações

### Gráficos

- [x] Gráfico de barras (Produção e Demanda) renderizado
- [x] Gráfico de linhas (Evolução da Simulação) renderizado
- [x] Gráficos atualizam ao avançar tempo

### Navegação

- [x] 8 links de navegação (Introdução, Metodologia, Mapa, Infraestrutura, Indicadores, Simulação, Fontes, Referências)
- [x] Scroll suave para seções (CSS scroll-behavior: smooth)
- [x] Navegação sticky permanece visível ao rolar

### Responsividade

- [x] Layout de simulação muda para coluna única abaixo de 1024px (não testado em dispositivo real)

## Problemas Conhecidos

1. **Coordenadas aproximadas**: Todas as coordenadas são geocodificadas, não GPS-confirmadas. Isso é declarado no rodapé, na seção de metodologia e nos popups.

2. **Dados do plano original**: Indicadores como extensão de rede água (509.966 m) e ligações (31.817) não possuem citação direta de fonte oficial verificável — são provenientes do plano original do projeto.

3. **AMAE indisponível**: A fonte AMAE retornou 404. Dados regulatórios sobre qualidade da água e índices de atendimento não estão disponíveis.

4. **Sem favicon**: O ícone de favorito retorna 404 (cosmético).

5. **Responsividade não testada em dispositivos reais**: A media query para 768px foi escrita mas não testada em celular/tablet.

## Conclusão

O site atende aos requisitos do TCC: dados rastreáveis, níveis de certeza declarados, sem dados inventados, tipografia acadêmica e funcionamento da simulação. Os únicos problemas são limitações de dados (coordenadas aproximadas, fontes indisponíveis) que já estão documentados e sinalizados no site.
