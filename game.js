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

// keyEvents

const playerSpeed = 120;
const jumpForce = 360;

keyDown('left', () => {
    player.move(-playerSpeed, 0);
})

keyDown('right', () => {
    player.move(+playerSpeed, 0);
})

keyDown('space', () => {
    if(player.grounded()) {
        player.jump(jumpForce)
    }
})

start("game")