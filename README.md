# Reconhecimento de Fala Web

Este projeto utiliza Node.js e Express para hospedar uma p\u00e1gina simples que demonstra o reconhecimento de fala do navegador. Ao clicar em **Iniciar Microfone**, o navegador solicita acesso ao microfone e todo o texto captado \u00e9 transcrito em tempo real em uma caixa de texto.

## Como usar

Instale as depend\u00eancias e inicie o servidor:

```bash
npm install
npm start
```

Abra `http://localhost:3000` em um navegador compat\u00edvel (Chrome ou Edge). Permita o acesso ao microfone e comece a falar para ver a transcri\u00e7\u00e3o aparecer.

## Transcri\u00e7\u00e3o de v\u00eddeos

Na p\u00e1gina tamb\u00e9m \u00e9 poss\u00edvel enviar um arquivo de v\u00eddeo para que o servidor extraia o \u00e1udio e tente transcrever o seu conte\u00fado. Basta selecionar o v\u00eddeo no campo **Transcrever V\u00eddeo** e clicar no bot\u00e3o correspondente. O resultado \u00e9 exibido em uma \u00e1rea de texto abaixo do player.
