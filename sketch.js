function setup() {
	angleMode (DEGREES)
	colorMode(RGB)
	createCanvas(1000, 500)
	frameRate(5)
	noLoop(); 
	
	genome = ""
	letters = ".....FFFFFFFFFFFFF+-+-+-+-+-+-UU|||[][][]{}RrGgBbRrGgBbRGb".split("") 
	for (let i=0;i<500;i++){
		genome += random(letters)
	}
}//end setup 

function draw() {  
	
	let m = floor(random(genome.length))
	
	switch(random(["replace","replace","insert","delete"])){
		case "replace":
			genome = setCharAt(genome, m, random(letters)) 
		break; 		
		case "insert": 
			genome = insertCharAt(genome, m, random(letters)) 
		break;
		case "delete": 
			genome = deleteCharAt(genome, m) 
		break; 
	}

	//background(0)
	let turtle = [{
			x:0, 
			y:0, 
			r:50,
			th:0,
			red:100, 
			green:100,
			blue: 100
	}] 
	
	polygons = []
	_polygon = {points:[], color: color(100,100,100)} 
	polygons.push(_polygon)
	stack = [_polygon] 
	points = []
	
	for(let i=0;i<genome.length;i++){
		let check = genome.charAt(i); 
		switch (check){
			case ".": 
				stack[-1].points.push({x: turtle[-1].x, y: turtle[-1].y}); 
				points.push({x: turtle[-1].x, y: turtle[-1].y})
			break; 
			case "+": turtle[-1].th += 10; break; 
			case "-": turtle[-1].th -= 10; break; 
			case "U": turtle[-1].th += 180; break; 
			case "F": 
				turtle[-1].x += cos(turtle[-1].th)*19; 
				turtle[-1].y += sin(turtle[-1].th)*10;
			break; 		
			case "[": turtle.push(JSON.parse(JSON.stringify(turtle[-1]))); break;
			case "]": if (turtle.length >1) {turtle.pop()}; break;
			case "{": 
				var _polygon = {points:[], color: color(turtle[-1].red, turtle[-1].green, turtle[-1].blue)};
				polygons.push(_polygon);
				stack.push(_polygon)
			break;
			case "}": if (stack.length >1) 
				{_polygon = stack.pop()
				_polygon.color = color(turtle[-1].red, turtle[-1].green, turtle[-1].blue)
				}; 
			break;
			case "R": if(turtle[-1].red<200) turtle[-1].red +=10; break;
			case "r": if(turtle[-1].red>10) turtle[-1].red -=10; break; 
			case "G": if(turtle[-1].green<200) turtle[-1].green +=10; break;
			case "g": if(turtle[-1].green>10) turtle[-1].green -=10; break; 
			case "B": if(turtle[-1].blue<200) turtle[-1].blue +=10; break;
			case "b": if(turtle[-1].blue>10) turtle[-1].blue -=10; break; 			
			
		} //end switch 
	} // end for each genome
	
	clear()
	translate(width/2, height/2)
	stroke(0) 
	for (var i=0; i<polygons.length; i++){
		if (polygons[i].points.length >= 3){
			fill(polygons[i].color)
			beginShape(); 
			for (var j=0; j<polygons[i].points.length; j++){
				vertex(polygons[i].points[j].x,polygons[i].points[j].y) 
			}
			endShape(); 
		}
	} 	
	
	noFill(); 
	strokeWeight(2)
	stroke(200)
	beginShape();
	for (var i=0; i<points.length; i++){
		vertex(points[i].x,points[i].y) 
	} 	
	endShape()
	
	console.log(genome)
} //end draw 

Object.defineProperty(Array.prototype, '-1', {
  get() { return this[this.length - 1] }
});

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

function insertCharAt (str, index, chr) {
    return str.substring(0, index) + chr + str.substring(index, str.length);
};

function deleteCharAt (str, index) {
    return str.substring(0, index) + str.substring(index+1, str.length);
};