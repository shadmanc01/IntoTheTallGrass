kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0, 0, 0, 1]
})

//sprites here
loadSprite('coin', 'img/coin.png')
loadSprite('floor', 'img/floor.png')

scene("game", () => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const map = [
        '                                           ',
        '                                           ',
        '                                           ',
        '                                           ',
        '                                           ',
        '                                           ',
        '                                           ',
        '                                           ',
        '                                           ',
        '                                           ',
        '                                           ',
        '                                           ',
        '                                           ',
        '===========================================',
    ]

    //assigning sprite
    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('floor', solid())]
    }

    const gameLevel = addLevel(map, levelCfg)

})

start("game")
