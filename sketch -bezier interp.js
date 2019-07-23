function setup() {
	angleMode (DEGREES)
	colorMode(RGB)
	createCanvas(1000, 500)
	//noLoop(); 
	
	critters = [] 
	new critter("XX") 

	
	
}//end setup 

function draw() { 
	frameRate(8) 
	background(255) 
	translate(width/5, height/2) 
	noFill(); 
	critters[-1].mutate(); 
	critters[-1].draw(); 
	
} //end draw 

function keyPressed() { if (keyCode === ENTER) { } }

// classes 
class critter {
	constructor (genome) {
		critters.push(this); 
		this.genome = genome 
		var nodes  = [] 
		var turtle = []
		turtle.push ({node: null, size: 1, len:1})
		for (var i=0; i<genome.length; i++){
			if (genome[i] == "X"){
				var size = turtle[-1].size
				var _node = {
					size:  turtle[-1].size, 
					len: turtle[-1].len,
					children: [],
					type: 1
					}
				nodes.push(_node); 
				if (turtle[-1].node != null) {
					_node.parent = turtle[-1].node; 
					turtle[-1].node.children.push(_node) 
				}
				turtle[-1].node =  _node; 
			} 
			if (genome[i] == ","){
				var _node = {
					type: null
					}
				if (turtle[-1].node != null) {
					turtle[-1].node.children.push(_node) 
				}
			} 
			else if (genome[i] == "[") {	
				var newTurtle = {
					node: turtle[-1].node, 
					size: turtle[-1].size,
					len: turtle[-1].len
				}
				turtle.push(newTurtle)
			}
			else if (genome[i] == "]" && turtle.length > 1) {	
				turtle.pop(); 
			} 
			else if (genome[i] == "L") {	
				turtle[-1].len += 1
			} 
			else if (genome[i] == "l" && turtle[-1].len > 1) {	
				turtle[-1].len -= 1
			} 
			else if (genome[i] == "S") {	
				turtle[-1].size += 1
			} 
			else if (genome[i] == "s" && turtle[-1].size > 1) {	
				turtle[-1].size -= 1
			} 
		}
		nodes[0].x = 0 
		nodes[0].y = 0
		nodes.forEach(function(node){
			if (node.parent != null) { 
				node.heading = atan2(node.y - node.parent.y, node.x - node.parent.x)
			}
			else {node.heading = -90}
			
			var childCount = node.children.length 
			var angle = node.heading - 180 
			var stepAngle = 360 / (childCount + 1) 
			angle += stepAngle 
			
			node.children.forEach(function(child){
				if (child.type != null) { 
					child.angle = angle + 180
					child.x = node.x + cos(angle)*7*child.len
					child.y = node.y + sin(angle)*7*child.len
				} 
				angle += stepAngle 	  
			}) 
		})
		this.nodes = nodes
	} //end critter constructor 
	
	mutate() {
		var genome = this.genome
		switch(random("AAABBC".split(""))){
			case "A": 
				var index = floor(random(genome.length))
				genome = genome.slice(0,index) + random("XXXXX[][],LlSs".split("")) + genome.slice(index)
				new critter(genome); 
			break; 
			case "B": 
				if (genome.length > 10) {
					var index = floor(random(genome.length))
					genome = genome.slice(0,index) + genome.slice(index+1)
					new critter(genome); 
				}
			break; 
		}
	} 
	draw () { 
		console.log(this.genome); 
		this.nodes.forEach(function(node){
			node.children.forEach(function(child){
				if (child.type != null) {
					var p1x = node.x 
					var p1y = node.y	
					var c1x = p1x + cos(node.heading) * node.len * 5
					var c1y = p1y + sin(node.heading) * node.len * 5
					var p2x = child.x 
					var p2y = child.y	
					var c2x = p2x + cos(child.angle) * child.len * 5
					var c2y = p2y + sin(child.angle) * child.len * 5 
					//bezier(p1x,p1y, c1x,c1y, c2x, c2y, p2x, p2y); 
					//line(p1x,p1y,p2x,p2y)
					for (var t=0; t<1; t+=0.2) {
						var dx1 = bezierTangent(p1x, c1x, c2x, p2x, t)
						var dy1 = bezierTangent(p1y, c1y, c2y, p2y, t)
						var th1 = atan2(dy1, dx1); 
						var x1 = bezierPoint(p1x, c1x, c2x, p2x, t)
						var y1 = bezierPoint(p1y, c1y, c2y, p2y, t)
						var r1 = lerp(node.size, child.size, t) * 7
						var left1x = x1 + cos(th1 + 90) * r1 
						var left1y = y1 + sin(th1 + 90) * r1 
						var right1x = x1 + cos(th1 - 90) * r1 
						var right1y = y1 + sin(th1 - 90) * r1 
						
						var t2 = t + 0.2
						var dx2 = bezierTangent(p1x, c1x, c2x, p2x, t2)
						var dy2 = bezierTangent(p1y, c1y, c2y, p2y, t2)
						var th2 = atan2(dy2, dx2); 
						var x2 = bezierPoint(p1x, c1x, c2x, p2x, t2)
						var y2 = bezierPoint(p1y, c1y, c2y, p2y, t2)
						var r2 = lerp(node.size, child.size, t2) * 7
						var left2x = x2 + cos(th1 + 90) * r2 
						var left2y = y2 + sin(th1 + 90) * r2
						var right2x = x2 + cos(th1 - 90) * r2 
						var right2y = y2 + sin(th1 - 90) * r2 
						
						fill(0)
					
						beginShape();
						vertex(left1x, left1y)
						vertex(left2x, left2y)
						vertex(right2x, right2y)
						vertex(right1x, right1y)
						endShape(CLOSE);
					
					} 
				}
			})
		}) 
		/*
		this.nodes.forEach(function(node){
			fill(0)
			circle(node.x, node.y, node.size*2)
		})
		*/ 
	} 

}// end critter class  

// housekeeping functions 
Object.defineProperty(Array.prototype, '-1', {
  get() { return this[this.length - 1] }
});

