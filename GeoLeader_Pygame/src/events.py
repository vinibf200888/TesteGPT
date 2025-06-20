"""Gerencia eventos aleatórios do jogo."""

import random


def check_monthly_events(game_state, ui):
    """Dispara eventos aleatórios ao avançar o mês."""
    if random.random() < 0.1:
        ui.show_popup("Protestos nas ruas!", on_view=lambda: print("VIEW EVENT"))


def update(game_state):
    pass
