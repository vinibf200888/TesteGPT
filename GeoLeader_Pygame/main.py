import pygame
from config import WINDOW_WIDTH, WINDOW_HEIGHT, FPS
from src.game_state import GameState
from src.map_renderer import MapRenderer
from src.ui import UI
from src import events


def main():
    pygame.init()
    screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
    pygame.display.set_caption("GeoLeader")
    clock = pygame.time.Clock()

    game_state = GameState()
    map_renderer = MapRenderer(game_state)
    ui = UI(game_state)

    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE:
                game_state.advance_time()
                events.check_monthly_events(game_state, ui)
            ui.handle_event(event)

        game_state.update()
        screen.fill((0, 0, 0))
        map_renderer.draw(screen)
        ui.draw(screen)

        pygame.display.flip()
        clock.tick(FPS)

    pygame.quit()


if __name__ == "__main__":
    main()
