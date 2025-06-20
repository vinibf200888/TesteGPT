#ifndef GAME_MANAGER_HPP
#define GAME_MANAGER_HPP

#include <SFML/Graphics.hpp>

class GameManager {
public:
    GameManager(sf::RenderWindow& win);
    void handleEvent(const sf::Event& event);
    void update();
    void render();
private:
    sf::RenderWindow& window;
};

#endif // GAME_MANAGER_HPP
