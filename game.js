kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1]
})

//sprites here
loadSprite('coin', 'img/coin.png')
loadSprite('floor', 'img/floor.png')

scene("game", () => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const map = [
        '                                                         ',
        '                                                         ',
        '                                                         ',
        '                                                         ',
        '                                                         ',
        '                                                         ',
        '                                                         ',
        '                                                         ',
        '                                                         ',
        '                                                         ',
        '                                                         ',
        '                                                         ',
        '                                                         ',
        '                                                         ',
        '                                                         ',
        '                                                         ',
        '                                                         ',
        '===========================================          ====',
        '===========================================          ====',
        '===========================================          ====',
        '===========================================          ====',
    ]

    //assigning sprite
    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('floor', solid())]
    }

    const gameLevel = addLevel(map, levelCfg)

})


keyEvents

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

const player = add([
    sprite('mario'), solid(),
    pos(30, 0),
    body(),
    big(),
    origin('bot')
  ])

  action('mushroom', (m) => {
    m.move(20, 0)
  })

  player.on("headbump", (obj) => {
    if (obj.is('coin-surprise')) {
      gameLevel.spawn('$', obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn('}', obj.gridPos.sub(0,0))
    }
    if (obj.is('mushroom-surprise')) {
      gameLevel.spawn('#', obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn('}', obj.gridPos.sub(0,0))
    }
  })

  player.collides('mushroom', (m) => {
    destroy(m)
    player.biggify(6)
  })

  player.collides('coin', (c) => {
    destroy(c)
    scoreLabel.value++
    scoreLabel.text = scoreLabel.value
  })

  action('dangerous', (d) => {
    d.move(-ENEMY_SPEED, 0)
  })

  player.collides('dangerous', (d) => {
    if (isJumping) {
      destroy(d)
    } else {
      go('lose', { score: scoreLabel.value})
    }
  })

  player.action(() => {
    camPos(player.pos)
    if (player.pos.y >= FALL_DEATH) {
      go('lose', { score: scoreLabel.value})
    }
  })

  player.collides('pipe', () => {
    keyPress('down', () => {
      go('game', {
        level: (level + 1) % maps.length,
        score: scoreLabel.value
      })
    })
  })
  
start("game")
