# Reconhecimento de Fala

Este projeto usa Node.js e Express para servir uma página que transcreve o áudio capturado pelo microfone do Windows. Ao clicar em **Iniciar Microfone**, o navegador pede permissão para acessar o microfone e o texto falado aparece em tempo real na tela.

## Como usar

Instale as dependências e inicie o servidor:

```bash
npm install
npm start
```

Abra `http://localhost:3000` em um navegador compatível (Chrome ou Edge), permita o acesso ao microfone e comece a falar para ver a transcrição.

## Aprimorar transcrição de músicas

Para obter resultados melhores ao transcrever canções, defina a variável de ambiente `OPENAI_API_KEY` com sua chave da OpenAI. Quando essa variável estiver presente o servidor usará o modelo `whisper-1` da OpenAI para analisar o áudio enviado e gerar a transcrição palavra por palavra, mesmo em trechos com instrumentais.

## Transcrição de vídeos

Também é possível enviar um arquivo de vídeo para que o servidor extraia o áudio e tente transcrever o conteúdo. Basta selecionar o vídeo no campo **Transcrever Vídeo** e clicar no botão correspondente. O resultado é exibido em uma área de texto abaixo do player.

## Transcrever YouTube

Para transcrever um vídeo do YouTube, cole o link no campo **Transcrever YouTube** e clique em **Carregar Vídeo**. Depois pressione **Transcrever YouTube** para iniciar a captura. O navegador solicitará que você compartilhe uma aba com áudio; escolha a aba do YouTube. O áudio será gravado por alguns segundos e então enviado para transcrição.

## Jogo da Velha

O diretório `tic-tac-toe` contém um pequeno jogo da velha em HTML, CSS e JavaScript com um agente de aprendizado por reforço. Abra o arquivo `index.html` em um navegador para iniciar o treino. Após um tempo de treino você pode exportar o algoritmo clicando em **Exportar Algoritmo**.

Clique em **Jogar contra Robô** para escolher a Q-Table que o robô utilizará na partida. Após selecionar o arquivo, o agente carregará esse conhecimento e jogará sempre tentando vencer. Clique nas casas do tabuleiro para fazer sua jogada e o robô responderá automaticamente.

### Reutilizando o modelo treinado

1. Treine o agente no arquivo `tic-tac-toe/index.html` até que os resultados estejam satisfatórios.
2. Clique em **Exportar Algoritmo** para baixar o arquivo `qtable.json` com a tabela Q aprendida.
3. Guarde esse arquivo em um local seguro.
4. Quando quiser reutilizar o modelo, abra `index.html` e use o botão **Carregar Q-Table** para selecionar o arquivo `qtable.json` salvo.
5. Após o carregamento o treino continuará a partir dos valores salvos.
