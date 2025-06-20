class GameState:
    """Armazena o estado atual do jogo."""

    def __init__(self):
        self.month = 1
        self.year = 2023

        # Indicadores econômicos
        self.gdp = 2.65  # PIB em trilhões
        self.inflation = 5.0  # Percentual

        # Indicadores políticos
        self.popularity = 50  # Popularidade do presidente
        self.congress_approval = 50  # Aprovação no congresso

    def advance_time(self):
        self.month += 1
        if self.month > 12:
            self.month = 1
            self.year += 1

    def update(self):
        # Atualiza lógica do jogo a cada frame
        pass
