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


class Popup:
    """Simple modal popup with two buttons."""

    def __init__(self, text, on_view, on_dismiss):
        self.text = text
        self.on_view = on_view
        self.on_dismiss = on_dismiss
        self.font = pygame.font.SysFont('arial', 18)

        width, height = 400, 180
        self.rect = pygame.Rect(
            (WINDOW_WIDTH - width) // 2,
            150,
            width,
            height,
        )

        self.view_button = Button(
            (self.rect.left + 40, self.rect.bottom - 50, 100, 30),
            "VIEW",
            self.on_view,
        )
        self.dismiss_button = Button(
            (self.rect.right - 140, self.rect.bottom - 50, 100, 30),
            "DISMISS",
            self.on_dismiss,
        )

    def handle_event(self, event):
        self.view_button.handle_event(event)
        self.dismiss_button.handle_event(event)

    def draw(self, surface):
        pygame.draw.rect(surface, (30, 30, 30), self.rect)
        pygame.draw.rect(surface, (200, 200, 200), self.rect, 2)
        rendered = self.font.render(self.text, True, (255, 255, 255))
        text_rect = rendered.get_rect(center=(self.rect.centerx, self.rect.top + 40))
        surface.blit(rendered, text_rect)
        self.view_button.draw(surface)
        self.dismiss_button.draw(surface)


class UI:
    def __init__(self, game_state):
        self.game_state = game_state
        self.font = pygame.font.SysFont('arial', 18)

        self.popup = None

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
        if self.popup:
            self.popup.handle_event(event)
            return

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
            f"PIB:{self.game_state.gdp:.2f}T  "
            f"Inf:{self.game_state.inflation:.1f}%  "
            f"Pop:{self.game_state.popularity}%  "
            f"Cong:{self.game_state.congress_approval}%"
        )
        rendered = self.font.render(text, True, (255, 255, 255))
        pygame.draw.rect(surface, (20, 20, 20), (0, 0, WINDOW_WIDTH, 30))
        surface.blit(rendered, (10, 5))

        for btn in self.buttons:
            btn.draw(surface)

        if self.popup:
            self.popup.draw(surface)

    def show_popup(self, text, on_view=None, on_dismiss=None):
        def view_wrapper():
            if on_view:
                on_view()
        def dismiss_wrapper():
            if on_dismiss:
                on_dismiss()
            self.popup = None
        self.popup = Popup(text, view_wrapper, dismiss_wrapper)
