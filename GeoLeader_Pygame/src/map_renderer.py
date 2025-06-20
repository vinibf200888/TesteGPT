import pygame
from config import MAP_IMAGE


class MapRenderer:
    def __init__(self, game_state):
        self.game_state = game_state
        try:
            self.map_image = pygame.image.load(MAP_IMAGE)
        except pygame.error:
            self.map_image = pygame.Surface((800, 400))
            self.map_image.fill((30, 30, 30))

    def draw(self, surface):
        surface.blit(self.map_image, (0, 0))
