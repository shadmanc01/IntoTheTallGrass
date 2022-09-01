kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
})

//JS Variables
const playerSpeed = 220;
const jumpForce = 550;
const FALL_DEATH = 700; 
const ENEMY_SPEED = 120;
const BOSS_SPEED = 300;
let boss_health = 20;
let minion_health = 1;

//sprites here
loadSprite('background', 'img/background.png')
loadSprite('coin', 'img/coin.png')
loadSprite('floor', 'img/floor.png')
loadSprite('mario', 'img/mario.png')
loadSprite('enemy', 'img/goomba1.png')
loadSprite('boss', 'img/boss.png')
loadSprite('tree', 'img/tree.png')
loadSprite('qBlock', 'img/qBlock.png')
loadSprite('block', 'img/block.png')
loadSprite('brick', 'img/brick.png')
loadSound('route1', 'sound/route1.mp3')

//Sounds
const music = play('route1', {
  loop: true
})
volume(0.5)

//Functions
function patrol(speed, dir = 1) {
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

function addButton2(txt, position, goGame) {

  const btn = add([
    text(txt),
    pos(position),
    area({ cursor: "pointer", }),
    scale(1),
    origin("center")
  ])

  btn.onClick(() => {
    go(goGame, { score: 0})
  })

  onKeyDown('space', () => {
    go(goGame, {score:0})
})

onKeyDown('enter', () => {
  go(goGame, {score:0})
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

//Scenes
scene("game", ({ score }) => {
    layers(['bg', 'obj', 'ui'], 'obj')
    let mainScreen = add([
      sprite("background"),
      pos(width() / 6, height() / 8),
      origin("center"),
      scale(3),
      fixed(),
    ]);

    const map = [
      '                                                                                                                                                                                                =',
      '                                                                                                                                                                                                =',
      '                                                                                                                                                                                                =',
      '                                                                                                                                                                                                =',
      '                                                                                                                                                                                                =',
      '                                                                                                                                                                                                =',
      '                   ?                                                         zzzzzzzz    zzz?               ?          zzz    z??z                                                              =',
      '                                                                                                                                                                                                =',
      '                                                                                                                                                                                                =',
      '                                                             ?                                                                                                                                  =',
      '             ?   z?z?z                     ==         ==                  z?z               ?      zz    ?  ?  ?    z          zz      z  z          zz  zz                                X    =',
      '                                   ==      ==         ==                                                                              zz  zz        zzz  zzz                                    =',
      '                         ==        ==      ==         ==                                                                             zzz  zzz      zzzz  zzzz                                   =',
      '                         ==        ==      ==     x x ==                               z         x x              x x               zzzz  zzzz    zzzzz  zzzzz                                  =',
      '==================================================================  ================   =================================================  =============  ========================================',
      '==================================================================  ================   =================================================  =============  ========================================',

    ]

    //assigning sprite
    const levelCfg = {
        width: 20,
        height: 20,
        '=': () => [sprite('floor'), solid(), area()],
        'x': () => [sprite('enemy'), solid(), area(), body(), scale(.05), origin('bot'), patrol(70), 'dangerous'],
        'X': () => [sprite('boss'), solid(), area(), body(), scale(.1), origin('bot'), patrol(300), 'boss'],
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
    area({shape: "rect", width: 70, height: 200}),
    scale(.15),
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

  let isJumping = true;

  player.onCollide('coin', (c) => {
    destroy(c)
    scoreLabel.value++
    scoreLabel.text = scoreLabel.value
  })

  player.onCollide('dangerous', (d) => {
    if (isJumping) {
      minion_health--;
      if(minion_health === 0) destroy(d);
      scoreLabel.value += 2;
      scoreLabel.text = scoreLabel.value;
      minion_health++;
    } else {
      go('lose', { score: scoreLabel.value})
    }
  })

  player.onCollide('boss', (d) => {
    if (isJumping) {
      boss_health--;
      if(boss_health === 0) {
      destroy(d);
      boss_health = 20
      scoreLabel.value += 100;
      scoreLabel.text = scoreLabel.value;
      go('win', { score: scoreLabel.value})
      }
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
scene('win', ({score}) => {
  let mainScreen = add([
    sprite("background"),
    pos(width() / 6, height() / 8),
    origin("center"),
    scale(3),
    fixed(),
  ]);
  add([text('You Win'), pos(680, 150)])
  add([text(score, 32), origin('center'), pos(840, 285)])
  addButton2("Restart", vec2(850, 400), "game")    
})

scene('lose', ({ score }) => {
  let mainScreen = add([
    sprite("background"),
    pos(width() / 6, height() / 8),
    origin("center"),
    scale(3),
    fixed(),
  ]);
  add([text('You Lose'), pos(325, 200)])
  add([text(score, 32), origin('center'), pos(width()/2, height()/2)])
  addButton2("Restart", vec2(514, 450), "game")
})

scene('Home', () => {
  let mainScreen = add([
    sprite("background"),
    pos(width() / 6, height() / 8),
    origin("center"),
    scale(3),
    fixed(),
  ]);
  add([text('Pokemon Adventure'), pos(470, 200)])
  addButton2("Play", vec2(850, 400), "game")
})

go("win", { score: 0})

// reset cursor to default at frame start for easier cursor management
onUpdate(() => cursor("default"))
