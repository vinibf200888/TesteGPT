# GeoLeader: Simulador Político Global (C++ Edition)

Projeto inicial para um jogo 2D de geopolítica em C++. Este repositório contém a estrutura básica do projeto conforme o prompt fornecido.

## Estrutura

- `src/` códigos fontes principais
- `assets/` imagens, fontes e sons
- `include/` cabeçalhos públicos
- `libs/` dependências externas (SFML, ImGui, JSON)
- `build/` diretório de compilação

## Compilação
Use CMake >= 3.8 com suporte a C++17. Exemplos:

```bash
mkdir -p build && cd build
cmake ..
make
```

## Dependências

- [SFML](https://www.sfml-dev.org/)
- [Dear ImGui](https://github.com/ocornut/imgui)
- [JSON for Modern C++](https://github.com/nlohmann/json)
