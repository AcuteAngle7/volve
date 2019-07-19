function setup() {
<<<<<<< Updated upstream
  angleMode (DEGREES)
  colorMode(RGB)
  createCanvas(1200, 1000)
  frameRate(1)
  
  tree = {
	  name: "tree",
	  type: "plant", 
	  population: 1, 
	  size: 1,
	  water: 0, 
	  sun: 0 
  } 
  
   horse = {
	  name: "horse", 
	  type: "herbivore", 
	  population: 1, 
	  size: 1,
	  speed: 1,
	  food: 0, 
	  water: 0
  } 
  
   tiger = {
	  name: "tiger", 
	  type: "carnivore", 
	  population: 1, 
	  size: 1,
	  speed: 1,
	  food: 0, 
	  water: 0
  } 
  
  species = [tree, horse, tiger]
   
  phase = "spawn" 
   
  var water, sun 

  
}//end setup 

function draw() {  

console.log(phase)

	if (phase == "spawn"){
		water = floor(randomGaussian(10,5))
		sun = floor(randomGaussian(10,5))
		
		for (var specie of species){
			specie.population += 1
		}
		
		phase = "feed" 
	} 

	else if (phase == "feed"){
		water -=1 
		sun -=1 
		if (sun <= 0 || water <= 0) { phase = "cull"} 
	} 
	
	else if (phase == "cull"){
		phase = "spawn"
	} 

for (var specie of species){
			console.log(specie.name, specie.population)
	} 
console.log(water, sun)


} //end draw 
=======
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
	strokeWeight(3)
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
					child.x = node.x + cos(angle)*30*child.len
					child.y = node.y + sin(angle)*30*child.len
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
				var index = floor(random(genome.length))
				genome = genome.slice(0,index) + genome.slice(index+1)
				new critter(genome); 
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
					var c1x = p1x + cos(node.heading) * node.len * 20
					var c1y = p1y + sin(node.heading) * node.len * 20
					var p2x = child.x 
					var p2y = child.y	
					var c2x = p2x + cos(child.angle) * child.len * 20
					var c2y = p2y + sin(child.angle) * child.len * 20 
					bezier(p1x,p1y, c1x,c1y, c2x, c2y, p2x, p2y); 
					//line(p1x,p1y,p2x,p2y)
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

>>>>>>> Stashed changes
