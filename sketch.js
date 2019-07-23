function setup() {
	angleMode (DEGREES)
	colorMode(RGB)
	createCanvas(1000, 500)
	noLoop(); 
	
	critters = [] 
	new critter() 
	
	rect1 = []
	rect1.push([-100,50])
	rect1.push([-100,-50])
	rect1.push([100,-50])
	rect1.push([100,50])
	
	rect2 = []
	rect2.push([-70,40])
	rect2.push([-70,-40])
	rect2.push([130,-40])
	rect2.push([130,40])
	
}//end setup 

function draw() { 
	frameRate(8) 
	background(255) 
	translate(width/2, height/2) 
	noFill(); 
	
	beginShape();
	for (var i=0;i<rect1.length;i++){
		vertex(rect1[i][0],rect1[i][1])
	} 
	endShape(CLOSE); 
	
	beginShape();
	for (var i=0;i<rect1.length;i++){
		vertex(rect2[i][0],rect2[i][1])
	} 
	endShape(CLOSE); 
	
	
	//critters[-1].mutate(); 
	//critters[-1].draw(); 
	
} //end draw 

function keyPressed() { if (keyCode === ENTER) { } }

// classes 
class critter {
	constructor () {
		critters.push(this); 
		this.genome = "AA" 
	} //end critter constructor 
	
	mutate() {
	} // end critter mutate
	draw () { 
	}//end critter draw

}// end critter class  

// housekeeping functions 
Object.defineProperty(Array.prototype, '-1', {
  get() { return this[this.length - 1] }
});