kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    background: [0, 0, 0, 1]
})

//JS Variables
const playerSpeed = 120;
const jumpForce = 550;
const FALL_DEATH = 700; 
const ENEMY_SPEED = 120;
const boss_health = 10;

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
        '                                                                                    ====                                                                      ',
        '                                                                                                                                                              ',
        '                                                                                                                                                              ',
        '                                                                                ====    ====                                                                  ',
        '                                                                                                                                                              ',
        '                                                                                                       ===                                                    ',
        '                                                                             x               x         ===                                                    ',
        '                                                                      =====================================                                                   ',
        '                                                                      =====================================                                                   ',
        '                                                                      =====================================   x           ==                   ==      x       ',
        '                                                          ========                                         =================     =   x =       =================',
        '                                                                                                           =================     ========       ================',
        '                                                                                                           =================                   ================',
        '                                                                                                                                                              ',
        '                                                                    =============                                      =   x   x =                             ',
        '                                                                                =                                      ===========                             ',
        '                                                                                =                                                                              ',
        '                                                                                =                                                        =    x    x  =        ',
        '                                                          ===========           =                                                      ================        ',
        '                                                                          =======         =    xx      =      =         x             ==               ==         ',
        '                                                     =                                    ==============      =========================                 ==    ',
        '                         ==                        = =                                    =                                                               ====  ',
        '          =====         ===                      = = =               =====                =                                                                  =  ',
        '                       ====    =               = = = =             =                      =                                                                  =  ',
        '                      =====    ==            = = = = =           =                        =                                                                  =  ',
        '              x    x ======    ===   x   x = = = = = =   x   x  =                         =                                                                  =  ',
        '===========================    ==================================                         =                                                                  =   ',
        '===========================    ==================================                         =                                                                  =   ',
        '===========================    ==================================                         =                                                                  =   ',
        '===========================    ==================================                         ==================================================================== ',
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
        '=': () => [sprite('floor'), solid(), area()],

        'x': () => [sprite('enemy'),
         solid(),
         area(),
          body(),
           scale(.05), 
           origin('bot'),
          //  area(),
           patrol(),
           'dangerous'],
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
    area(),
    //big(),
    origin('bot')
  ])

   onUpdate('mushroom', (m) => {
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

 
  // action('dangerous', (d) => {
  //     d.move(-ENEMY_SPEED, 0)
  // })


  let isJumping = true;

  player.onCollide('dangerous', (d) => {
    if (isJumping) {
      destroy(d)
    } else {
      go('lose', { score: scoreLabel.value})
    }
  })

  player.onUpdate(() => {
    camPos(player.pos)
    if (player.pos.y >= FALL_DEATH) {
     go('lose', { score: scoreLabel.value})
    }
  })

  player.onCollide('pipe', () => {
    keyPress('down', () => {
      go('game', {
        level: (level + 1) % maps.length,
        score: scoreLabel.value
      })
    })
  })

//keyEvents
 onKeyDown('left', () => {
     player.move(-playerSpeed, 0);
 })

 onKeyDown('right', () => {
     player.move(+playerSpeed, 0);
 })

 player.onUpdate(() => {
  if(player.isGrounded()) {
    isJumping = false
  }
})

 onKeyDown('space', () => {
     if(player.isGrounded()) {
      isJumping = true
      player.jump(jumpForce)
     }
 })
})

scene('lose', ({ score }) => {
  add([text(score, 32), origin('center'), pos(width()/2, height()/2)])
})

go("game", { score: 0})