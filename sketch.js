function setup() {
	angleMode (DEGREES)
	colorMode(RGB)

	createCanvas(1200, 1000)
	_green = color(154,205,50)
	_blue = color (106,90,205)
	_gray = color (220,220,220)
	noFill();

	creatures = []
	var creature = {}
	creatures.push(creature) 
	creature.nodes = []
	var node1 = {
		connections: [],  
		size: 30,
		type: "rigid", 
		jointRange: 30,
		recursiveLimit: 3
	}  
	var connection = {
		target: 1, 
		positionR: 100, 
		positionTh: 90,		
		control1R: 50, 
		control1Th: 45,
		control2R: 50, 
		control2Th: -45,
		reflection: false,
		terminalOnly: false
	}
	node1.connections.push(connection)
	var node2 = {
		connections: [],  
		size: 30,
		type: "rigid", 
		jointRange: 30,
		recursiveLimit: 3
	}  
	creature.nodes.push(node1, node2) 
	
	creatures[1] = JSON.parse(JSON.stringify(creature))
	creatures[1].nodes[0].size = 40
	
	console.log (creatures) 
	
	
  
  
  
  var a,b,c,d,e,f,g,h
  a=random(500)
  b=random(500)
  c=random(500)
  d=random(500)
  e=random(500)
  f=random(500)
  g=random(500)
  h=random(500)

  var central = [ ]
  var dorsal = [] 
  var ventral = [] 
	
  let steps = 10;
  for (let i = 0; i <= steps; i++) {
    let t = i / steps;
    let x = bezierPoint(a, c, e, g, t);
    let y = bezierPoint(b, d, f, h, t);
  
    central.push([x,y])
   
    let tx = bezierTangent(a, c, e, g, t);
    let ty = bezierTangent(b, d, f, h, t);
    let th = atan2(ty, tx);
    th -= 90;  
    var r = lerp(10,100,t)
    dorsal.push([cos(th)*r+x,sin(th)*r+ y])
  
    th += 180;
    ventral.push([cos(th)*r+x,sin(th)*r+y])
  }
 
  noStroke()
  for (var i=0; i<central.length-1; i++){
	var t = i / steps;
    fill(lerpColor(_blue,_green, t))
    beginShape()
	vertex(central[i][0],central[i][1])
	beginShape()
	vertex(dorsal[i][0],dorsal[i][1])
	vertex(ventral[i][0],ventral[i][1])
	vertex(ventral[i+1][0],ventral[i+1][1])
	vertex(dorsal[i+1][0],dorsal[i+1][1])
	endShape(CLOSE)
  }  
  
}//end setup 

function draw() {
  
} //end draw 

function vector (r, th) {
	this.r = r 
	this.th = th
	this.x = r * cos(th) 
	this.y = r * sin(th)
} 
