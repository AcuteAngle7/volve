function setup() {
	angleMode (DEGREES)
	colorMode(RGB)
	createCanvas(1000, 500)
	
	//frameRate(20) 
	
	genome = ""
	letters = "CCCCC+-<>CC+-<>CC+-<><><><>Aa|||()()()RrGgBbRrGgBbRGb".split("") 
	for (let i=0;i<50;i++){
		genome += random(letters)
	}
	
	//noLoop();
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

	clear() 
	translate(0, height/2)
	//background(0)
	let turtle = [{
			x:0, 
			y:0, 
			r:50,
			th:0,
			red:100, 
			green:100,
			blue: 100,
			circle: null
	}] 
	
	circles = [] 
	
	noStroke(); 
	for(let i=0;i<genome.length;i++){
		let check = genome.charAt(i); 
		switch (check){
			case "C": 
				turtle[-1].x += 1.5* turtle[-1].r * cos(turtle[-1].th);
				turtle[-1].y += 1.5* turtle[-1].r * sin(turtle[-1].th);
				var _circle={
					x: turtle[-1].x,
					y: turtle[-1].y,
					r: turtle[-1].r,
					red: turtle[-1].red,
					green: turtle[-1].green,
					blue: turtle[-1].blue,
					parent: turtle[-1].circle
				}
				circles.push(_circle);
				turtle[-1].circle = _circle 
				
			break; 
			case "+": turtle[-1].r += 5; break; 
			case "-": turtle[-1].r -= 5; break; 
			case "<": turtle[-1].th -= 7; break; 
			case ">": turtle[-1].th += 7; break; 
			case "A": turtle[-1].th -= 23; break; 
			case "a": turtle[-1].th += 23; break; 
			case "(": turtle.push(JSON.parse(JSON.stringify(turtle[-1]))); break;
			case ")": if (turtle.length >1) {turtle.pop()}; break;
			case "R": if(turtle[-1].red<200) turtle[-1].red +=10; break;
			case "r": if(turtle[-1].red>10) turtle[-1].red -=10; break; 
			case "G": if(turtle[-1].green<200) turtle[-1].green +=10; break;
			case "g": if(turtle[-1].green>10) turtle[-1].green -=10; break; 
			case "B": if(turtle[-1].blue<200) turtle[-1].blue +=10; break;
			case "b": if(turtle[-1].blue>10) turtle[-1].blue -=10; break; 			
			
		} //end switch 
	} // end for each genome 
	for(i=1;i<circles.length;i++){
		for (t=0; t<1; t+= 0.2){
			parentColor = color(circles[i].parent.red,circles[i].parent.green, circles[i].parent.blue); 
			childColor = color(circles[i].red,circles[i].green, circles[i].blue); 
			var _color = lerpColor(parentColor,childColor, t)   		
			fill(_color);
			var _x = lerp( circles[i].parent.x,circles[i].x, t)
			var _y = lerp( circles[i].parent.y,circles[i].y, t)
			var _r = lerp( circles[i].parent.r,circles[i].r, t)
			circle(_x, _y, _r); 
		}
	}

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