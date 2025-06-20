import pygame
from config import WINDOW_WIDTH


class Button:
    """Simple clickable rectangle button."""

    def __init__(self, rect, text, callback):
        self.rect = pygame.Rect(rect)
        self.text = text
        self.callback = callback
        self.font = pygame.font.SysFont('arial', 18)

    def draw(self, surface):
        pygame.draw.rect(surface, (50, 50, 50), self.rect)
        rendered = self.font.render(self.text, True, (255, 255, 255))
        text_rect = rendered.get_rect(center=self.rect.center)
        surface.blit(rendered, text_rect)

    def handle_event(self, event):
        if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            if self.rect.collidepoint(event.pos):
                self.callback()


class UI:
    def __init__(self, game_state):
        self.game_state = game_state
        self.font = pygame.font.SysFont('arial', 18)

        # Left side menu buttons
        self.buttons = []
        button_width = 180
        button_height = 40
        padding = 10
        labels = [
            "Economy",
            "Health",
            "Education",
            "Security",
            "Foreign Affairs",
            "Policies",
        ]
        for i, label in enumerate(labels):
            rect = (
                10,
                50 + i * (button_height + padding),
                button_width,
                button_height,
            )
            self.buttons.append(
                Button(rect, label, lambda l=label: print(l))
            )

    def handle_event(self, event):
        for btn in self.buttons:
            btn.handle_event(event)

    def draw(self, surface):
        month_names = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ]
        month_year = f"{month_names[self.game_state.month - 1]} " \
                     f"{self.game_state.year}"
        text = (
            f"{month_year}  "
            f"{self.game_state.treasury:.2f}T  "
            f"{self.game_state.economy_health}%  "
            f"{self.game_state.congress_approval}%"
        )
        rendered = self.font.render(text, True, (255, 255, 255))
        pygame.draw.rect(surface, (20, 20, 20), (0, 0, WINDOW_WIDTH, 30))
        surface.blit(rendered, (10, 5))

        for btn in self.buttons:
            btn.draw(surface)
