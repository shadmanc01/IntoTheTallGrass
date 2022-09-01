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
loadSprite('qBlock', 'img/qBlock.png')
loadSprite('block', 'img/block.png')
loadSprite('brick', 'img/brick.png')

//Functions
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

function addButton2(txt, p) {

  const btn = add([
    text(txt),
    pos(p),
    area({ cursor: "pointer", }),
    scale(1),
    origin("center")
  ])

  btn.onClick(() => {
    go("game", { score: 0})
  })

  onKeyDown('space', () => {
    go("game", {score:0})
})

onKeyDown('enter', () => {
  go("game", {score:0})
})

  btn.onUpdate(() => {
    if (btn.isHovering()) {
      const t = time() * 10
      btn.color = rgb(
        wave(0, 255, t),
        wave(0, 255, t + 2),
        wave(0, 255, t + 4)
      )
      btn.scale = vec2(1.2)
    } else {
      btn.scale = vec2(1)
      btn.color = rgb()
    }
  })
}

scene("game", ({ score }) => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const map = [
      '                                                                                                                                                                                                                 ',
      '                                                                                                                                                                                                                 ',
      '                                                                                                                                                                                                                 ',
      '                                                                              x x                                                                                                                                ',
      '                   ?                                                         zzzzzzzz    zzz?               ?          zzz    z??z                                                         ==                    ',
      '                                                                                                                                                                                          ===                    ',
      '                                                                                                                                                                                         ====                    ',
      '                                                             ?                                                                                                                          =====                    ',
      '             ?   z?z?z                     ==         ==                  z?z               ?      zz    ?  ?  ?    z          zz      z  z          zz  zz            zz?z            ======                    ',
      '                                   ==      ==         ==                                                                              zz  zz        zzz  zzz                          =======                    ',
      '                         ==        ==      ==         ==                                                                             zzz  zzz      zzzz  zzzz     zz              zz ========                    ',
      '                         ==        ==      ==     x x ==                               z         x x              x x               zzzz  zzzz    zzzzz  zzzzz    zz        x x   zz=========                    ',
      '==================================================================  ================   =================================================  =============  ========================================================',
      '==================================================================  ================   =================================================  =============  ========================================================',
    ]

    //assigning sprite
    const levelCfg = {
        width: 20,
        height: 20,
        '=': () => [sprite('floor'), solid(), area()],
        'x': () => [sprite('enemy'), solid(), area(), body(), scale(.05), origin('bot'), patrol(), 'dangerous'],
        'X': [sprite('boss'), solid(), 'dangerous', scale(.1)],
        '$': () => [sprite('coin'), 'coin', area()],
        '?': () => [sprite('qBlock'), solid(), area(), 'qBlock'],
        '}': () => [sprite('block'), solid(), area(), 'block'],
        'z': () => [sprite('brick'), solid(), area()],
    }

    const gameLevel = addLevel(map, levelCfg)

    const scoreLabel = add([
      text(score),
      pos(0,0),
      layer('ui'),
      fixed(),
      {
        value: score,
      }
    ])


//player data
const player = add([
    sprite('mario'), solid(),
    pos(30, 0),
    body(),
    area(),
    //big(),
    origin('bot')
  ])

   onUpdate('mushroom', (m) => {
     m.move(20, 0)
   })

  player.onHeadbutt((obj) => {
    if (obj.is('qBlock')) {
      gameLevel.spawn('$', obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn('}', obj.gridPos.sub(0,0))
    }
    /*
    if (obj.is('mushroom-surprise')) {
      gameLevel.spawn('#', obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn('}', obj.gridPos.sub(0,0))
    }
    */
  })

 
  // action('dangerous', (d) => {
  //     d.move(-ENEMY_SPEED, 0)
  // })


  let isJumping = true;


  player.onCollide('coin', (c) => {
    destroy(c)
    scoreLabel.value++
    scoreLabel.text = scoreLabel.value
  })

  player.onCollide('dangerous', (d) => {
    if (isJumping) {
      destroy(d)
      scoreLabel.value++
      scoreLabel.text = scoreLabel.value
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
  add([text('You Lose'), pos(325, 200)])
  add([text(score, 32), origin('center'), pos(width()/2, height()/2)])
  addButton2("Restart", vec2(514, 450))
})

scene('Home', () => {
  add([text('Pokemon Adventure'), pos(325, 200)])
  addButton2("Play", vec2(514, 450))
})

go("Home", { score: 0})


// reset cursor to default at frame start for easier cursor management
onUpdate(() => cursor("default"))
