cmake_minimum_required(VERSION 3.8)
project(GeoLeaderCpp)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add source files
file(GLOB_RECURSE SOURCES src/*.cpp)

add_executable(GeoLeader ${SOURCES})

# Example linking for SFML - adjust paths as necessary
find_package(SFML 2.5 COMPONENTS graphics window system REQUIRED)

target_link_libraries(GeoLeader PRIVATE sfml-graphics sfml-window sfml-system)

include_directories(include src)
