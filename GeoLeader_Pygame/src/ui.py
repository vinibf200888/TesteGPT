import pygame
from config import WINDOW_WIDTH


class UI:
    def __init__(self, game_state):
        self.game_state = game_state
        self.font = pygame.font.SysFont('arial', 18)

    def handle_event(self, event):
        pass

    def draw(self, surface):
        month_year = f"{self.game_state.month:02d}/" \
                     f"{self.game_state.year}"
        text = (
            f"Data: {month_year}  "
            f"Reservas: {self.game_state.treasury:.2f}T  "
            f"Economia: {self.game_state.economy_health}%  "
            f"Congresso: {self.game_state.congress_approval}%"
        )
        rendered = self.font.render(text, True, (255, 255, 255))
        pygame.draw.rect(surface, (20, 20, 20), (0, 0, WINDOW_WIDTH, 30))
        surface.blit(rendered, (10, 5))
