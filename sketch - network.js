function setup() {
	angleMode (DEGREES)
	colorMode(RGB)
	createCanvas(1000, 500)
	noLoop(); 
	translate(width/2, height/2)
	
	critters = [] 
	for (var i=0; i<100; i++){
		new critter(true)
	}	
	critters[0].draw()
}//end setup 

function draw() { 
	translate(0, height/2) 
	noFill(); 
} //end draw 


function keyPressed() {
  if (keyCode === ENTER) {
	  background(255);
	  critters.random().draw(); 
	  
  } 
}

Object.defineProperty(Array.prototype, '-1', {
  get() { return this[this.length - 1] }
});

Array.prototype.random = function () {
	var index = floor(random(this.length)); 	
	return this[index]; 
} 

function subdivide(){
} 

class critter {
	constructor (spawn) {
		critters.push(this) 
		this.nodes = []
		this.strips = []
		this.circles = [] 
		if (spawn) {
			for (var i=0;i<3;i+=random()){
				this.nodes.push(new node(randomGaussian(50, 10)))
			}
			for (var i=0;i<this.nodes.length;i++){
				for (var j=0;j<randomGaussian(2,1);j++){ 
					this.nodes[i].edges.push({
						target: this.nodes.random(),
						count: random(3),
						direction: random (-80,80),
						reach: randomGaussian(50,25),
						steps: randomGaussian(4,2)
						}) 
				}
			}
			var circles = [] 
			circles.push({x:0,y:0,r:this.nodes[0].size,parent:null})
			var stack = [{node: this.nodes[0],circle:circles[0]}]
			while (stack.length > 0) {
				var _pop = stack.pop()
				_pop.node.edges.forEach(function(element){
					if (element.count > 0) {
						element.count -= 1 
						var x = _pop.circle.x + cos(element.direction) * element.reach 
						var y = _pop.circle.y + sin(element.direction) * element.reach 
						var r = element.target.size
						element.target.edges.forEach(function(element2){
							var circ = {x:x, y:y, r:r, parent: _pop.circle}
							circles.push(circ); 
							stack.push({node: element2.target, circle: circ}) 
						})
					}
				}) 
			} 
			this.circles = circles
		
		}
	}
	draw() {
		for(var i=1; i<this.circles.length;i++){
			var angle = atan2(this.circles[i].y-this.circles[i].parent.y, this.circles[i].x-this.circles[i].parent.x)
			var right = angle + 90 
			var left = angle -90 
			beginShape(QUAD_STRIP); 
			for (var j=0;j<1;j+=1/5){
				var x = lerp(this.circles[i].parent.x, this.circles[i].x,j)
				var y = lerp(this.circles[i].parent.y, this.circles[i].y,j)
				var r = lerp(this.circles[i].parent.r, this.circles[i].r,j)
				vertex (x + r*cos(right),y + r*sin(right));  
				vertex (x + r*cos(left),y + r*sin(left));
			} 
			var x = this.circles[i].x
			var y = this.circles[i].y
			var r = this.circles[i].r
			vertex (x + r*cos(right),y + r*sin(right));  
			vertex (x + r*cos(left),y + r*sin(left));
			endShape(); 
		} 
	} 
} 

class node {
	constructor (size) {
		this.size = size; 
		this.edges = [] 
	} 
} 
