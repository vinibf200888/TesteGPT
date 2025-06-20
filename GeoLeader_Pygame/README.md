# GeoLeader: Simulador Político Global

Este projeto implementa um jogo 2D de geopolítica criado com Python e Pygame. O objetivo é gerenciar um país e navegar por eventos políticos, econômicos e sociais.

## Estrutura
- `main.py` inicia o jogo e configura o loop principal.
- `config.py` armazena configurações globais.
- `src/` contém os módulos de lógica de jogo.
- `assets/` possui imagens, sons e fontes usados na interface. Este repositório
  **não** inclui o arquivo `assets/images/world_map.png`. Adicione sua própria
  imagem ou o jogo exibirá um mapa genérico em tons de cinza.
- `data/` guarda informações sobre países e estados iniciais.
- `saves/` receberá arquivos de progresso.

## Requisitos
- Python 3.10+
- [Pygame](https://www.pygame.org/)

Execute `pip install -r requirements.txt` para instalar dependências e inicie com:
```bash
python main.py
```
