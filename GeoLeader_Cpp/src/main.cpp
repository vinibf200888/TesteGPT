#include <SFML/Graphics.hpp>
#include "core/GameManager.hpp"

int main() {
    sf::RenderWindow window(sf::VideoMode(1280, 720), "GeoLeader - Political Simulator");

    GameManager game(window);

    while (window.isOpen()) {
        sf::Event event;
        while (window.pollEvent(event)) {
            if (event.type == sf::Event::Closed)
                window.close();

            game.handleEvent(event);
        }

        game.update();
        window.clear();
        game.render();
        window.display();
    }

    return 0;
}
