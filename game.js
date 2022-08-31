kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1]
})

//JS Variables
const playerSpeed = 120;
const jumpForce = 400;
const FALL_DEATH = 700;
const ENEMY_SPEED = 120;

//sprites here
loadSprite('coin', 'img/coin.png')
loadSprite('floor', 'img/floor.png')
loadSprite('mario', 'img/mario.png')
loadSprite('enemy', 'img/goomba1.png')
loadSprite('boss', 'img/boss.png')
loadSprite('tree', 'img/tree.png')

scene("game", ({ score }) => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const map = [
        '                                                                                                                                                              ',
        '                                                                                                                                                              ',
        '                                                                                    ====                                                                          ',
        '                                                                                                                                                              ',
        '                                                                                                                                                              ',
        '                                                                                ====    ====           ===                                                               ',
        '                                                                                                       ===                                                     ',
        '                                                                                                       ===                                                       ',
        '                                                                                                       ===                                                       ',
        '                                                                      ========================================================================================',
        '                                                                      ========================================================================================',
        '                                                                      ========================================================================================',
        '                                                          ========                                                                                            ',
        '                                                                                                                                                              ',
        '                                                                                                                                                              ',
        '                                                                                                                                                              ',
        '                                                                    =========                                                                                 ',
        '                                                                                                                                                              ',
        '                                                                                                                                                              ',
        '                                                                                                                                                              ',
        '                                                          ===========                                                                                         ',
        '                                                                          ======                                                                              ',
        '                                                     =                                                                                                        ',
        '                         ==                        = =                                                                                                        ',
        '          =====         ===                      = = =           =======                                                                                      ',
        '                       ====    =               = = = =                                                                                                        ',
        '                      =====    ==            = = = = =                                                                                                        ',

        '              x    x ======    ===   x   x = = = = = =   x   x            x  x x                                                                                  ',

        '              x  X   ======    ===       x = = = = = =                                                                                                        ',

        '===========================    ================================                                                                                               ',
        '===========================    ================================                                                                                               ',
        '===========================    ================================                                                                                               ',
        '===========================    ================================                                                                                               ',
    ]
    
    //Function
    function patrol(speed = 60, dir = 1) {
      return {
        id: "patrol",
        require: [ "pos", "area", ],
        add() {
          this.on("collide", (obj, col) => {
            if (col.isLeft() || col.isRight()) {
              dir = -dir
            }
          })
        },
        update() {
          this.move(speed * dir, 0)
        },
      }
    }

    //assigning sprite
    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('floor'), solid()],

        'x': [
          sprite('enemy'),
          solid(),
          body(),
          // area(),
          patrol(),
          'dangerous'],

        //'x': [sprite('enemy'), solid(), 'dangerous', scale(.05)], 
        'X': [sprite('boss'), solid(), 'dangerous', scale(.1)],
    }

    const gameLevel = addLevel(map, levelCfg)

    const scoreLabel = add([
      text(score),
      pos(30, 300),
      layer('ui'),
      {
        value: score,
      }
    ])

//player data
const player = add([
    sprite('mario'), solid(),
    pos(30, 500),
    body(),
    //big(),
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
 
  // action('dangerous', (d) => {
  //     d.move(-ENEMY_SPEED, 0)
  // })


  let isJumping = true;

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

//keyEvents
 keyDown('left', () => {
     player.move(-playerSpeed, 0);
 })

 keyDown('right', () => {
     player.move(+playerSpeed, 0);
 })

 player.action(() => {
  if(player.grounded()) {
    isJumping = false
  }
})

 keyDown('space', () => {
     if(player.grounded()) {
      isJumping = true
      player.jump(jumpForce)
     }
 })
})

scene('lose', ({ score }) => {
  add([text(score, 32), origin('center'), pos(width()/2, height()/2)])
})

start("game", { score: 0})