class GameState:
    """Armazena o estado atual do jogo."""

    def __init__(self):
        self.month = 1
        self.year = 2023
        self.treasury = 2.65  # Trilhões
        self.economy_health = 100
        self.congress_approval = 50

    def advance_time(self):
        self.month += 1
        if self.month > 12:
            self.month = 1
            self.year += 1

    def update(self):
        # Atualiza lógica do jogo a cada frame
        pass
