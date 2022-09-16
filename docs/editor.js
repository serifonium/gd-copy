var canvas = document.getElementById("myCanvas");
var output = document.getElementById("output");
var ctx = canvas.getContext("2d");
var cx = 0
var cy = 0

var hoverpoint = v(0, 0)

var selected = false
var selectedPoint = v(0, 0)
var selectedBlock = undefined

var mode = "place"

var level = []
var mPoint = v(0, 0)

document.addEventListener("keydown", (e) => {
    if(mode === "place") {
        if(e.key === "Z") level.push({name:"jumpspace", pos:v(hoverpoint.x*4, hoverpoint.y*4), scale: v(64, 64), cooldown:[1000,1000], direction:"left"})
        if(e.key === "z") level.push({name:"jumpspace", pos:v(hoverpoint.x*4, hoverpoint.y*4), scale: v(64, 64), cooldown:[1000,1000], direction:"right"})
        if(e.key === "x") level.push({name:"gravspace", pos:v(hoverpoint.x*4, hoverpoint.y*4), scale: v(64, 64), cooldown:[1000,1000], rot:"up"})
        if(e.key === "X") level.push({name:"gravspace", pos:v(hoverpoint.x*4, hoverpoint.y*4), scale: v(64, 64), cooldown:[1000,1000], rot:"down"})
        if(e.key === "c") level.push({name:"warpspace", pos:v(hoverpoint.x*4, hoverpoint.y*4), scale: v(64, 64), cooldown:[1000,1000]})
    }
    if(e.key === "q") {mode = "place"; selectedBlock = undefined; document.getElementById("object").textContent = ""}
    if(e.key === "w") {mode = "select"; selectedPoint = undefined; selected = false}
    if(e.key === "e") mode = "destroy"
    if(e.key === "Escape") selected = false
})

document.addEventListener("mousemove", (e) => {
    let pos = v(e.clientX, e.clientY)
    hoverpoint = v(snap(pos.x+8, 16), snap(pos.y+8, 16) )
    mPoint = pos
})

document.addEventListener("mousedown", (e) => {
    
    let pos = v(e.clientX, e.clientY)
    if(pos.x < canvas.width && pos.y < canvas.height) {
        if(mode === "place") {
            if(selected) {
                level.push({name:"block", pos:v(
                    selectedPoint.x*4, selectedPoint.y*4
                ), scale: v((hoverpoint.x - selectedPoint.x)*4, (hoverpoint.y - selectedPoint.y)*4)})
                selected = false
            } else {
                selected = true
                selectedPoint = hoverpoint
            }
        }
        if(mode === "select") {
            for(let o of level) {if(testRectCollision(pos.x*4, pos.y*4, 1, 1, o.pos.x, o.pos.y, o.scale.x, o.scale.y)) {
                selectedBlock = o
                document.getElementById("object").textContent = ""
                if(selectedBlock.name === "jumpspace") {
                    document.getElementById("object").textContent += "Jump Orb: {direction: "
                    let direction = document.createElement("select")
                    direction.id = "direction"
                    let right = document.createElement("option")
                    right.textContent = "right"
                    let left = document.createElement("option")
                    left.textContent = "left"
                    direction.appendChild(right)
                    direction.appendChild(left)
                    document.getElementById("object").appendChild(direction)
                }
                if(selectedBlock.name === "gravspace") {
                    document.getElementById("object").textContent += "Gravity Orb: {rot: "
                    let rot = document.createElement("select")
                    rot.id = "rot"
                    let up = document.createElement("option")
                    up.textContent = "up"
                    let down = document.createElement("option")
                    down.textContent = "down"
                    let right = document.createElement("option")
                    right.textContent = "right"
                    let left = document.createElement("option")
                    left.textContent = "left"
                    rot.appendChild(right)
                    rot.appendChild(left)
                    rot.appendChild(up)
                    rot.appendChild(down)
                    document.getElementById("object").appendChild(rot)
                }
                if(selectedBlock.name === "block") {
                    document.getElementById("object").textContent += "Block"
                }
            }}
            
        }
        if(mode === "destroy") {
            for(let o of level) {if(testRectCollision(pos.x*4, pos.y*4, 1, 1, o.pos.x, o.pos.y, o.scale.x, o.scale.y)) {
                for(let i in level) {
                    if(level[i] === o) level.splice(i, 1)
                }
            }}
        }
    }
})


setInterval(() => {
    if(mode === "place") document.getElementById("mode").innerHTML = "Mode Selected : Place"
    if(mode === "select") document.getElementById("mode").innerHTML = "Mode Selected : Select"
    ctx.fillStyle="#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle="#ff0000"
    ctx.fillStyle="#ff0000"
    if(mode === "place") {
        ctx.beginPath();
        ctx.arc(hoverpoint.x, hoverpoint.y, 8, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke();
    }
    if(selected) {
        ctx.globalAlpha = 0.7
        ctx.fillStyle="#ffffff"
        ctx.fillRect(selectedPoint.x, selectedPoint.y, hoverpoint.x - selectedPoint.x, hoverpoint.y - selectedPoint.y)
        ctx.globalAlpha = 1
    }
    for(let o of level) {
        if(o.name === "block") {ctx.fillStyle="#ffffff"}
        if(o.name === "jumpspace") {ctx.fillStyle="#00ff00"}
        if(o.name === "gravspace") {ctx.fillStyle="#00bbff"}
        if(o.name === "warpspace") {ctx.fillStyle="#ffff00"}
        if(o === selectedBlock) {ctx.fillStyle="#66ff66"}
        ctx.fillRect(o.pos.x/4, o.pos.y/4, o.scale.x/4, o.scale.y/4)
    }
    document.getElementById("output").value = JSON.stringify(level)

    if(selectedBlock !== undefined && document.getElementById("object").textContent === "") {
    } if(selectedBlock !== undefined) {
        if(selectedBlock.name === "jumpspace") {
            selectedBlock.direction = document.getElementById("direction").value
        } if(selectedBlock.name === "gravspace") {
            selectedBlock.rot = document.getElementById("rot").value
        }
    }
    
}, 1000/60)