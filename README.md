# Jogo da Velha com Aprendizado por Reforço

Este repositório contém um experimento simples em que um agente aprende a jogar Jogo da Velha utilizando uma Q-Table. Todo o treinamento e o jogo acontecem direto no navegador.

## Como usar

Abra `tic-tac-toe/index.html` em um navegador moderno. O aplicativo possui um menu no topo com as opções **Jogar** e **Treinar**. Cada aba exibe apenas os controles necessários.

No menu **Treinar** é possível acompanhar o treinamento do robô. Algumas funcionalidades disponíveis:

- **Iniciar Treino** pausa ou continua o processo de aprendizagem.
- **Velocidade** permite ajustar o intervalo entre as jogadas ou ativar o `Modo Turbo` para acelerar.
- **Exportar Algoritmo** salva a Q-Table aprendida em um arquivo JSON.
- **Jogar contra Robô** fica disponível na aba **Jogar** e carrega uma Q-Table previamente exportada para desafiar o agente.

O algoritmo leva em conta simetrias do tabuleiro para reduzir a quantidade de partidas necessárias e alterna quem inicia cada jogo durante o treinamento, garantindo que o robô saiba jogar bem dos dois lados.
