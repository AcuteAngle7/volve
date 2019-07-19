function setup() {
	angleMode (DEGREES)
	colorMode(RGB)
	createCanvas(1000, 500)
	noLoop(); 
	
	critters = [] 
	critter = {points: [], w: [], p: [], strips:[], lsystem:[]}
	critters.push(critter);
	critter.w.push(["B",1],["F",1],["!",10],["[",1],["+",40],["!",1],["F",1],["!",1],["E",1],["]",1],["[",1],["-",25],["F",1],["!",10],["E",1],["]",1])
	critter.p.push({left: "B", right: [["Gb",1]]}, {left: "E", right: [["Ge",2]]}, {left: "F", right: [["f",50],["Gc",10],["f",50]]})
	
	var _lsystem = [] 
	critter.w.forEach(function(_w){
		var match = false
		critter.p.forEach(function(_p){
			if (_w[0] == _p.left) {
				match = true
				_p.right.forEach(function(_right){
					_lsystem.push(_right)
				})
			}
		})
		if (!match){_lsystem.push(_w)}
	}) 
	critter.lsystem = _lsystem;
	
	for (var i=0; i<1; i+=random(0.5)) {
		var index = floor(random(critter.lsystem.length)); 
		critter.lsystem[index][1] *= randomGaussian(1, 0.5)
	} 
	
	
	turtle = [{x:0, y:200, th:-90, r:20, cynx:null, cyny:null, cynr:null, ctrx:null, ctry:null}] 
	strips = []; 
	critter.lsystem.forEach(function (_lsystem){
		if (_lsystem[0] == "f") { 
			turtle[-1].x += _lsystem[1] * cos(turtle[-1].th);
			turtle[-1].y += _lsystem[1] * sin(turtle[-1].th);
		}
		else if (_lsystem[0] == "!") { 
			turtle[-1].r -= _lsystem[1];
		}
		else if (_lsystem[0] == "+") { 
			turtle[-1].th += _lsystem[1];
		}
		else if (_lsystem[0] == "-") { 
			turtle[-1].th -= _lsystem[1];
		}
		else if (_lsystem[0] == "[") { 
			turtle.push(JSON.parse(JSON.stringify(turtle[-1]))) 
		}
		else if (_lsystem[0] == "]" && turtle.length > 1) { 
			turtle.pop(); 
		}
		else if (_lsystem[0] == "Gb") { 
			turtle[-1].cynx = turtle[-1].x
			turtle[-1].cyny = turtle[-1].y
			turtle[-1].cynr = turtle[-1].r
			turtle[-1].ctrx = turtle[-1].x + 10 * cos(turtle[-1].th)
			turtle[-1].ctry = turtle[-1].y + 10 * sin(turtle[-1].th)
		}
		else if (_lsystem[0] == "Gc" || _lsystem[0] == "Ge") { 
			for (var i=0; i<1; i+=1/_lsystem[1]){
				var x1 = bezierPoint(turtle[-1].cynx, turtle[-1].ctrx, turtle[-1].x, turtle[-1].x + 10 * cos(turtle[-1].th), i)
				var y1 = bezierPoint(turtle[-1].cyny, turtle[-1].ctry, turtle[-1].y, turtle[-1].y + 10 * sin(turtle[-1].th), i)
				var x2 = bezierPoint(turtle[-1].cynx, turtle[-1].ctrx, turtle[-1].x, turtle[-1].x + 10 * cos(turtle[-1].th), i + 1/_lsystem[1])
				var y2 = bezierPoint(turtle[-1].cyny, turtle[-1].ctry, turtle[-1].y, turtle[-1].y + 10 * sin(turtle[-1].th), i + 1/_lsystem[1])				
				strips.push ({x1:x1,y1:y1,x2:x2,y2:y2})
			} 
			turtle[-1].cynx = turtle[-1].x
			turtle[-1].cyny = turtle[-1].y
			turtle[-1].cynr = turtle[-1].r
			turtle[-1].ctrx = turtle[-1].x + 50 * cos(turtle[-1].th)
			turtle[-1].ctry = turtle[-1].y + 50 * sin(turtle[-1].th)
		}
		
	})
	critter.strips = strips; 
	
}//end setup 

function draw() { 
	translate(width/2, height/2) 
	noFill(); 
	
	critter.strips.forEach(function(element){
		line(element.x1,element.y1,element.x2,element.y2);  
	})
} //end draw 


function keyPressed() {
  if (keyCode === ENTER) { setup (); draw()  } 
}

Object.defineProperty(Array.prototype, '-1', {
  get() { return this[this.length - 1] }
});

function subdivide(points){
	var _points = [] 
	_points.push(points[0]); 
	
	for(var i=1; i<points.length-2; i++) {
		if (i==0) {var A = points[0]}
			else {var A = points[i-1]}
		var B = points[i];
		var C = points[i+1]
		if (i+2 > points.length-1) {var D = points[-1]} 
			else {D = points[i+2]}
			
		var S = B.mult(18/32)
		S = S.add(C.mult(18/32)) 
		S = S.add(A.mult(-2/32))
		S = S.add(D.mult(-2/32)) 
		
		_points.push(B);
		_points.push(S);
		
	} 
	_points.push(points[-1]);
	return _points
	
} 

class p {
	constructor(x,y){
		this.x = x ;
		this.y = y 
	}
	add(q) {
		return new p(this.x + q.x, this.y + q.y)
	}
	mult (s) {
		return new p (this.x * s, 	this.y *s)
	}
} 


