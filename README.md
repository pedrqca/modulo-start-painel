# 🚀 Módulo Start - Painel de Controle & Ranking

Dashboard interativo com estética Cyberpunk desenvolvido em **React + Vite** para gerenciamento de competições, controle de tempo e pontuação de equipes em tempo real.

---

## 💻 Sobre o Projeto

Este painel foi projetado para automatizar e otimizar a gestão de torneios e desafios educacionais. Ele elimina a necessidade de planilhas manuais complexas, oferecendo uma interface centralizada para coordenadores controlarem o cronômetro oficial, validarem missões e acompanharem o placar dinâmico do evento.

### ⚡ Principais Funcionalidades

- **⚙️ Interface de Navegação Dupla (Abas):** 
  - **Aba Desafios:** Cadastro de equipes, customização do nome do evento/etapa e ajuste manual de pontuações de forma ágil.
  - **Aba Cronômetro:** Visualização do placar geral com grid dinâmico contendo o progresso individual das equipes em 10 exercícios simultâneos.
- **⏱️ Cronômetro Inteligente Otimizado:** Sistema de contagem regressiva contínuo que não sobrecarrega a renderização do navegador, com funções de iniciar, pausar, resetar e definir tempos customizados.
- **🏆 Critério de Desempate Automatizado:** O ranking reordena as equipes em tempo real seguindo a regra oficial:
  1. Maior pontuação total (soma dos pontos manuais e missões validadas).
  2. Menor tempo total acumulado no cumprimento das missões (critério de velocidade).
- **📥 Exportação de Relatórios (CSV):** Geração instantânea de um relatório formatado com o ranking final, pontuações parciais, tempos totais e carimbo de data/hora de cada exercício validado para abertura no Excel.
- **💾 Persistência de Dados:** Integração nativa com `localStorage`, garantindo que nenhuma pontuação ou minuto do cronômetro seja perdido caso a página seja atualizada acidentalmente.

---

## 🛠️ Tecnologias Utilizadas

- **React.js** (Componentização, Hooks de Estado e Performance com `useMemo`)
- **Vite** (Ferramental de build ultra-rápido)
- **CSS3 Moderno** (Variáveis nativas para o tema Dark/Cyberpunk e Grid Layout)

---

## 🚀 Como Executar o Projeto Localmente

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

1. **Clone o repositório:**
```bash
   git clone [https://github.com/pedrqca/modulo-start-painel.git](https://github.com/pedrqca/modulo-start-painel.git)