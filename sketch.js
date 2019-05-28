function setup() {
	angleMode (DEGREES)
	colorMode(RGB)
	createCanvas(500, 500)
	frameRate(1)
	  
	var shoulder = new circ(random(500),random(500),random(10,100))  
	var elbow = new circ(random(500),random(500),random(10,100)) 
	var wrist = new circ(random(500),random(500),random(10,100)) 	
  
	circle(shoulder.x,shoulder.y,shoulder.r)
	circle(elbow.x,elbow.y,elbow.r)  
	circle(wrist.x,wrist.y,wrist.r)
	
	constructPart(shoulder, elbow) 
	constructPart(elbow, wrist) 

}//end setup 

function draw() {  
} //end draw 

function circ(x,y,r){
	this.x = x 
	this.y = y 
	this.r = r
}

function linear(x0,y0,x1,y1){
	this.m = (y1-y0)/(x1-x0)
	this.b = (x1*y0 - x0*y1) / (x1-x0)
} 
function pointSlope(x1,y1,m){
	var _linear = new linear(0,0,1,1)
	_linear.m = m 
	_linear.b = y1 - m*x1
	return _linear 
} 
function intersect(line0, line1){
	var x = (line1.b-line0.b)/(line0.m-line1.m) 
	var y = line0.m * x + line0.b
	return [x,y]
}
 

function chaikin (p,cut) {  
	//var cut = 0.2
	var list = []
	for (var i=0; i<p.length; i++){
		let x0 = lerp (p[i-1][0],p[i][0],1-cut)
		let y0 = lerp (p[i-1][1],p[i][1],1-cut)
		let j = i+1 
		j = j > p.length-1 ? 0 : j 
		let x1 = lerp (p[i][0],p[j][0],cut)
		let y1 = lerp (p[i][1],p[j][1],cut)
		list.push([x0,y0],[x1,y1])
	}
	return list 
} 

function constructPart(c0,c1){	
	var a,b,c,d,r0,r1
	
	if (c0.r > c1.r){
		a = c0.x  
		b = c0.y
		c = c1.x
		d = c1.y
		r0 = c0.r
		r1 = c1.r
	}
	else {
		a = c1.x  
		b = c1.y
		c = c0.x
		d = c0.y
		r0 = c1.r
		r1 = c0.r
	} 	
	
	var D = sqrt(pow(c-a,2)+pow(d-b,2))
	var xp = (c*r0 - a*r1) / (r0-r1) 
	var yp = (d*r0 - b*r1) / (r0-r1)	
	var xt1 = a + (pow(r0,2)*(xp-a) + r0*(yp-b)*sqrt(pow(xp-a,2)+pow(yp-b,2)-pow(r0,2)))/(pow(xp-a,2)+pow(yp-b,2))
	var yt1 = b + (pow(r0,2)*(yp-b) - r0*(xp-a)*sqrt(pow(xp-a,2)+pow(yp-b,2)-pow(r0,2)))/(pow(xp-a,2)+pow(yp-b,2))
	var xt2 = a + (pow(r0,2)*(xp-a) - r0*(yp-b)*sqrt(pow(xp-a,2)+pow(yp-b,2)-pow(r0,2)))/(pow(xp-a,2)+pow(yp-b,2))
	var yt2 = b + (pow(r0,2)*(yp-b) + r0*(xp-a)*sqrt(pow(xp-a,2)+pow(yp-b,2)-pow(r0,2)))/(pow(xp-a,2)+pow(yp-b,2))
	var xt3 = c + (pow(r1,2)*(xp-c) + r1*(yp-d)*sqrt(pow(xp-c,2)+pow(yp-d,2)-pow(r1,2)))/(pow(xp-c,2)+pow(yp-d,2))
	var yt3 = d + (pow(r1,2)*(yp-d) - r1*(xp-c)*sqrt(pow(xp-c,2)+pow(yp-d,2)-pow(r1,2)))/(pow(xp-c,2)+pow(yp-d,2))
	var xt4 = c + (pow(r1,2)*(xp-c) - r1*(yp-d)*sqrt(pow(xp-c,2)+pow(yp-d,2)-pow(r1,2)))/(pow(xp-c,2)+pow(yp-d,2))
	var yt4 = d + (pow(r1,2)*(yp-d) + r1*(xp-c)*sqrt(pow(xp-c,2)+pow(yp-d,2)-pow(r1,2)))/(pow(xp-c,2)+pow(yp-d,2))
	

	var tan1 = new linear (xp,yp,xt1,yt1)
	var tan2 = new linear (xp,yp,xt2,yt2) 
	var m = (d-b)/(c-a)
	m = -1 / m
	
	var c0angle = atan2(d-b,c-a)+180
	var c0x = a + r0 * cos(c0angle)
	var c0y = b + r0 * sin(c0angle)
	var tan3 = pointSlope(c0x,c0y,m)
	
	var c1angle = atan2(b-d,a-c)+180
	var c1x = c + r1 * cos(c1angle)
	var c1y = d + r1 * sin(c1angle)
	var tan4 = pointSlope(c1x,c1y,m)

	
	var points = []
	points.push(intersect(tan1,tan3))
	points.push(intersect(tan1,tan4))
	points.push(intersect(tan2,tan4))
	points.push(intersect(tan2,tan3))
	
	points = chaikin(chaikin(chaikin(points,0.15),0.25),0.25)

	//noFill();
	fill(0)
	beginShape() 
	for (i=0; i<points.length; i++){
		vertex(points[i][0],points[i][1]) 
	}
	endShape(CLOSE)
	
}// end constructPart() 

Object.defineProperty(Array.prototype, '-1', {
  get() { return this[this.length - 1] }
});
