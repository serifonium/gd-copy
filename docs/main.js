var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var cx = 0
var cy = 0

var Player = {
    pos: v(32, 64*23),
    vel: v(0, 0),
    onGround: true,
    gravity: "down",
    movetype: "constant",
    direction: "right",
    level: [
        {name:"leveldata", pos:v(0, 0), scale: v(0, 0)},
        {name:"block", pos:v(0, 64*24), scale: v(64*20, 64*1)},
        {name:"block", pos:v(64*24, 64*24), scale: v(64*6, 64*1)},
        {name:"spike", pos:v(64*0, 64*24+48), scale: v(64*200, 16)},
        {name:"block", pos:v(64*9, 64*22), scale: v(64*4, 64*2)},
        {name:"block", pos:v(64*9, 64*20-32), scale: v(64*1, 64*1)},
        {name:"spike", pos:v(64*12+16, 64*21+32), scale: v(64*0.5, 64*0.5)},
        {name:"jumpspace", pos:v(64*32, 64*22), scale: v(64*1, 64*1), direction: "left", cooldown: [1000, 1000]},
        {name:"gravspace", pos:v(64*29, 64*19), scale: v(64*1, 64*1), rot:"up", cooldown: [2000, 2000]},
        {name:"block", pos:v(64*16, 64*16), scale: v(64*14, 64*1)},
        {name:"spike", pos:v(64*27, 64*17), scale: v(64*3, 16)},
        {name:"spike", pos:v(64*17, 64*17), scale: v(64*3-32, 16)},
        {name:"spike", pos:v(64*16, 64*15+48), scale: v(64*4.5, 16)},
        {name:"block", pos:v(64*-0.25+4, 64*0), scale: v(64*0.25, 64*24)},
        
        {name:"block", pos:v(64*16, 64*17), scale: v(64*1, 64*1)},
        {name:"gravspace", pos:v(64*10, 64*16+32), scale: v(64*1, 64*1), rot:"down", cooldown: [2000, 2000]},
        {name:"block", pos:v(64*4, 64*16), scale: v(64*3, 64*1)},
        {name:"jumpspace", pos:v(64*1, 64*14-32), scale: v(64*1, 64*1), direction: "right", cooldown: [1000, 1000]},
        {name:"block", pos:v(64*4, 64*13), scale: v(64*1.5, 64*1)},
        {name:"block", pos:v(64*14, 64*12), scale: v(64*2, 64*1)},
        {name:"jumpspace", pos:v(64*9+32, 64*12), scale: v(64*1, 64*1), cooldown: [1000, 1000]},

        {name:"block", pos:v(64*0, 64*7), scale: v(64*2, 64*1)},
        {name:"gravspace", pos:v(64*28, 64*13), scale: v(64*1, 64*1), rot:"right", cooldown: [2000, 2000]},
        {name:"spike", pos:v(64*27, 64*15.75), scale: v(64*3, 16)},
        {name:"block", pos:v(64*32, 64*8), scale: v(64*1, 64*8)},
        {name:"warpspace", pos:v(64*32, 64*4), scale: v(64*1, 64*1), channel: 1, cooldown: [2000, 2000]},
        {name:"warpspace", pos:v(64*35, 64*22), scale: v(64*1, 64*1), channel: 1, cooldown: [2000, 2000]},
        {name:"block", pos:v(64*38, 64*16), scale: v(64*1, 64*8)},
        {name:"gravspace", pos:v(64*39, 64*13), scale: v(64*1, 64*1), rot:"down", cooldown: [2000, 2000]},
        {name:"block", pos:v(64*39, 64*16), scale: v(64*9, 64*1)},
    ],
    Update: () => {
        if(Player.gravity === "down") {
            let a = true
            for(let h of Player.level) {if(testRectCollision(Player.pos.x+8, Player.pos.y+64, 48, 1, h.pos.x, h.pos.y, h.scale.x, h.scale.y)) {
                if(h.name === "block") {
                    a = false
                    if(Player.onGround === false) {
                        Player.pos.y = h.pos.y-64
                    }
                    Player.onGround = true
                }   
                if(h.name === "spike") Player.Reset()
            }}
            if(a) Player.onGround = false
            for(let h of Player.level) {if(Player.vel.x < 0 && testRectCollision(Player.pos.x, Player.pos.y, 1, 62, h.pos.x, h.pos.y, h.scale.x, h.scale.y)) {
                if(h.name === "block") Player.movetype === "platformer" ? Player.pos.x = h.pos.x+h.scale.x : Player.Reset()
                if(h.name === "spike") Player.Reset()
            }}
            for(let h of Player.level) {if(Player.vel.x > 0 && testRectCollision(Player.pos.x+64, Player.pos.y, 1, 62, h.pos.x, h.pos.y, h.scale.x, h.scale.y)) {
                if(h.name === "block") Player.movetype === "platformer" ? Player.pos.x = h.pos.x-64 : Player.Reset()
                if(h.name === "spike") Player.Reset()
            }}
            for(let h of Player.level) {if(Player.vel.y < 0 && testRectCollision(Player.pos.x+8, Player.pos.y, 48, 1, h.pos.x, h.pos.y, h.scale.x, h.scale.y)) {
                if(h.name === "block") {Player.pos.y = h.pos.y+h.scale.y; Player.vel.y = 0}
                if(h.name === "spike") Player.Reset()
            }}
            if(Player.onGround === false) Player.vel.y += 1
            else Player.vel.y = 0
            if(Player.movetype === "constant") Player.direction === "right" ? Player.vel.x = 8 : Player.vel.x = -8 
        } if(Player.gravity === "up") {
            let a = true
            for(let h of Player.level) {if(testRectCollision(Player.pos.x+8, Player.pos.y, 48, 1, h.pos.x, h.pos.y, h.scale.x, h.scale.y)) {
                if(h.name === "block") {
                    a = false
                    if(Player.onGround === false) {
                        Player.pos.y = h.pos.y+h.scale.y
                    }
                    Player.onGround = true
                }   
                if(h.name === "spike") Player.Reset()
            }}
            if(a) Player.onGround = false
            for(let h of Player.level) {if(Player.vel.y < 0 && testRectCollision(Player.pos.x+8, Player.pos.y, 48, 1, h.pos.x, h.pos.y, h.scale.x, h.scale.y)) {
                if(h.name === "block") {Player.pos.y = h.pos.y+h.scale.y; Player.vel.y = 0}
                if(h.name === "spike") Player.Reset()
            }}
            for(let h of Player.level) {if(Player.vel.x < 0 && testRectCollision(Player.pos.x, Player.pos.y+8, 1, 56, h.pos.x, h.pos.y, h.scale.x, h.scale.y)) {
                if(h.name === "block") Player.movetype === "platformer" ? Player.pos.x = h.pos.x+h.scale.x : Player.Reset()
                if(h.name === "spike") Player.Reset()
            }}
            for(let h of Player.level) {if(Player.vel.x > 0 && testRectCollision(Player.pos.x+64, Player.pos.y+8, 1, 56, h.pos.x, h.pos.y, h.scale.x, h.scale.y)) {
                if(h.name === "block") Player.movetype === "platformer" ? Player.pos.x = h.pos.x-64 : Player.Reset()
                if(h.name === "spike") Player.Reset()
            }}
            
            if(Player.onGround === false) Player.vel.y += -1
            else Player.vel.y = 0
            if(Player.movetype === "constant") Player.vel.x = -8
        } if(Player.gravity === "left") {
            let a = true
            for(let h of Player.level) {if(testRectCollision(Player.pos.x, Player.pos.y+8, 1, 48, h.pos.x, h.pos.y, h.scale.x, h.scale.y)) {
                if(h.name === "block") {
                    a = false
                    if(Player.onGround === false) {
                        Player.pos.x = h.pos.x+h.scale.x
                    }
                    Player.onGround = true
                }   
                if(h.name === "spike") Player.Reset()
            }}
            if(a) Player.onGround = false
            for(let h of Player.level) {if(Player.vel.x > 0 && testRectCollision(Player.pos.x+64, Player.pos.y+8, 1, 48, h.pos.x, h.pos.y, h.scale.x, h.scale.y)) {
                if(h.name === "block") {Player.pos.x = h.pos.x-64; Player.vel.x = 0}
                if(h.name === "spike") Player.Reset()
            }}
            for(let h of Player.level) {if(Player.vel.y < 0 && testRectCollision(Player.pos.x+12, Player.pos.y, 48, 1, h.pos.x, h.pos.y, h.scale.x, h.scale.y)) {
                console.log(Player.pos)
                if(h.name === "block") {Player.movetype === "platformer" ? Player.pos.y = h.pos.y+h.scale.y : Player.Reset();}
                if(h.name === "spike") Player.Reset()
                
            }}
            for(let h of Player.level) {if(Player.vel.y > 0 && testRectCollision(Player.pos.x+8, Player.pos.y+64, 56, 1, h.pos.x, h.pos.y, h.scale.x, h.scale.y)) {
                if(h.name === "block") Player.movetype === "platformer" ? Player.pos.x = h.pos.x-64 : Player.Reset()
                if(h.name === "spike") Player.Reset()
            }}
            
            if(Player.onGround === false) Player.vel.x += -1
            else Player.vel.x = 0
            if(Player.movetype === "constant") Player.vel.y = -8
        } if(Player.gravity === "right") {
            let a = true
            for(let h of Player.level) {if(testRectCollision(Player.pos.x+64, Player.pos.y+8, 1, 48, h.pos.x, h.pos.y, h.scale.x, h.scale.y)) {
                if(h.name === "block") {
                    a = false
                    if(Player.onGround === false) {
                        Player.pos.x = h.pos.x-65
                    }
                    Player.onGround = true
                }   
                if(h.name === "spike") Player.Reset()
            }}
            if(a) Player.onGround = false
            for(let h of Player.level) {if(Player.vel.x > 0 && testRectCollision(Player.pos.x, Player.pos.y+8, 1, 48, h.pos.x, h.pos.y, h.scale.x, h.scale.y)) {
                if(h.name === "block") {Player.pos.x = h.pos.x+h.scale.x; Player.vel.x = 0}
                if(h.name === "spike") Player.Reset()
            }}
            for(let h of Player.level) {if(Player.vel.y < 0 && testRectCollision(Player.pos.x+8, Player.pos.y, 56, 1, h.pos.x, h.pos.y, h.scale.x, h.scale.y)) {
                console.log(Player.pos)
                if(h.name === "block") {Player.movetype === "platformer" ? Player.pos.y = h.pos.y+h.scale.y : Player.Reset();}
                if(h.name === "spike") Player.Reset()
                
            }}
            for(let h of Player.level) {if(Player.vel.y > 0 && testRectCollision(Player.pos.x+8, Player.pos.y+64, 56, 1, h.pos.x, h.pos.y, h.scale.x, h.scale.y)) {
                if(h.name === "block") Player.movetype === "platformer" ? Player.pos.x = h.pos.x-64 : Player.Reset()
                if(h.name === "spike") Player.Reset()
            }}
            
            if(Player.onGround === false) Player.vel.x += 1
            else Player.vel.x = 0
            if(Player.movetype === "constant") Player.vel.y = -8
        }
    },
    Reset: () => {
        Player.pos = v(32, 64*23)
        Player.vel = v(0, 0)
        Player.gravity = "down"
        Player.direction = "right"
    }
}
let keydowns = false
document.addEventListener("keydown", (e) => {
    if(e.key === "w" || e.key === " ") {
        keydowns = "w"
        for(let h of Player.level) {if(testRectCollision(Player.pos.x, Player.pos.y, 64, 64, h.pos.x, h.pos.y, h.scale.x, h.scale.y)) {
            if(h.name === "jumpspace") {
                if(h.direction !== undefined) {h.direction === "right" ? Player.direction = "right" : Player.direction = "left"}
                if(h.cooldown !== undefined) {
                    if(h.cooldown[0] === h.cooldown[1]) {
                        Player.gravity === "down" ? Player.vel.y = -17 : (Player.gravity === "left" ? Player.vel.x = 17 : (Player.gravity === "right" ? Player.vel.x = -17 : Player.vel.y = 17))
                        h.cooldown[0] += -1
                        console.log(h.cooldown)
                    }
                } else {
                    Player.gravity === "down" ? Player.vel.y = -17 : (Player.gravity === "left" ? Player.vel.x = 17 : (Player.gravity === "right" ? Player.vel.x = -17 : Player.vel.y = 17))
                }
            }
            if(h.name === "gravspace") {
                if(h.cooldown[0] === h.cooldown[1]) {
                    h.cooldown[0] += -1
                    Player.gravity = h.rot
                    
                }
            }
            if(h.name === "warpspace") {
                if(h.cooldown[0] === h.cooldown[1]) {       
                    for(let o of Player.level) {if(h.channel === o.channel) {
                        h.cooldown[0] += -1
                        Player.pos.x = o.pos.x
                        Player.pos.y = o.pos.y
                        keydowns = ""
                    }}
                }
            }
        }}
    }
    if(e.key === "d") {
        keydowns = "d"
    }
    if(e.key === "a") {
        keydowns = "a"
    } 
})
document.addEventListener("keyup", (e) => {
    if(Player.movetype === "platformer") {
        if(e.key === "d") {
            Player.vel.x = 0
            keydowns = ""
        } 
        if(e.key === "a") {
            Player.vel.x = 0
            keydowns = ""
        } 
    }
    if(e.key === "w" || e.key === " ") {
        keydowns = ""
    } 
})


setInterval(() => {
    
    

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.fillStyle="#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.translate(cx, cy)
    ctx.fillStyle="#0000ff"
    ctx.fillRect(Player.pos.x, Player.pos.y, 64, 64)
    for(let o of Player.level) {
        if(o.name === "block") ctx.fillStyle="#ffffff"; 
        if(o.name === "spike") ctx.fillStyle="#ff0000"; 
        if(o.name === "jumpspace") {
            if(o.cooldown !== undefined) {
                if(o.cooldown[0] <= 0) o.cooldown[0] = o.cooldown[1] 
                else if(o.cooldown[0] !== o.cooldown[1]) {o.cooldown[0] += -1000/60}
                
            }
            ctx.fillStyle="#00ff00"; 
        }
        if(o.name === "gravspace") {ctx.fillStyle="#00bbff";
            if(o.cooldown !== undefined) {
                if(o.cooldown[0] <= 0) o.cooldown[0] = o.cooldown[1] 
                else if(o.cooldown[0] !== o.cooldown[1]) {o.cooldown[0] += -1000/60}
                
            }
        } 
        if(o.name === "warpspace") {ctx.fillStyle="#ffff00"
            if(o.cooldown !== undefined) {
                if(o.cooldown[0] <= 0) o.cooldown[0] = o.cooldown[1] 
                else if(o.cooldown[0] !== o.cooldown[1]) {o.cooldown[0] += -1000/60}
                
            }
        }
        ctx.fillRect(o.pos.x, o.pos.y, o.scale.x, o.scale.y)
    }

    if(Player.movetype === "platformer") {
        if(keydowns === "d") {
            if(Player.vel.x > 0) {if(Player.vel.x <= 7) Player.vel.x += 0.5}
            else Player.vel.x = 2
        }
        if(keydowns === "a") {
            if(Player.vel.x < 0) {if(Player.vel.x >= -7) Player.vel.x += -0.5}
            else Player.vel.x = -2
        }
        
    }  
    Player.Update()
    
    if (Player.pos.x < window.innerWidth / 2) {
        cx = 0
    } else {
        cx = -(Player.pos.x - window.innerWidth / 2)
    }
    if (Player.pos.y < window.innerHeight / 2) {
        cy = 0
    } else if (Player.pos.y > 64*24+32 - window.innerHeight / 2) {
        cy = -(64*24+32 - window.innerHeight)
    } else {
        cy = -(Player.pos.y - window.innerHeight / 2)
    }
    
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    //ctx.translate(cx, cy)
}, 1000/60)


setInterval(() => {
    Player.pos.x += Player.vel.x/4
    Player.pos.y += Player.vel.y/4
    if(keydowns === "w") {
        if(Player.onGround === true) {
            Player.gravity === "down" ? Player.vel.y = -17 : (Player.gravity === "left" ? Player.vel.x = 17 : (Player.gravity === "right" ? Player.vel.x = -17 : Player.vel.y = 17))
        }
    } 
}, 1000/240)
