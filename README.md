# Transcri\u00e7\u00e3o de V\u00eddeos

Este projeto usa Node.js e Express para disponibilizar uma p\u00e1gina onde \u00e9 poss\u00edvel enviar um v\u00eddeo e obter sua transcri\u00e7\u00e3o. O bot\u00e3o **Iniciar Transcri\u00e7\u00e3o** envia o v\u00eddeo selecionado ao servidor e o texto resultante \u00e9 exibido ap\u00f3s o processamento.

## Como usar

Instale as depend\u00eancias e inicie o servidor:

```bash
npm install
npm start
```

Abra `http://localhost:3000` em um navegador compat\u00edvel (Chrome ou Edge). Selecione um arquivo de v\u00eddeo, clique em **Iniciar Transcri\u00e7\u00e3o** e aguarde o resultado aparecer na tela.

## Transcri\u00e7\u00e3o de v\u00eddeos

Na p\u00e1gina tamb\u00e9m \u00e9 poss\u00edvel enviar um arquivo de v\u00eddeo para que o servidor extraia o \u00e1udio e tente transcrever o seu conte\u00fado. Basta selecionar o v\u00eddeo no campo **Transcrever V\u00eddeo** e clicar no bot\u00e3o correspondente. O resultado \u00e9 exibido em uma \u00e1rea de texto abaixo do player.
