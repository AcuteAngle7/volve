function setup() {
  angleMode (DEGREES)
  colorMode(RGB)
  
   createCanvas(900, 900)
  _green = color(154,205,50)
  _blue = color (106,90,205)
  _gray = color (220,220,220)
  //noStroke()
  noFill()
  
  nodes = [] 
  for (var i=0; i<20; i++){
	var _node = new node() 
	nodes.push(_node)
	
    }
  
    for (var n=0; n<nodes.length; n++){ 
		var edges=[] 
		for (var i=0; i<randomGaussian(1,1); i++){
			edges.push({ 
				node: nodes[floor(random(20))],
				distance: abs(randomGaussian(150,50)),
				angle: random(360)
			})
		}
		nodes[n].edges = edges
	}
 
  joints = [] 
  limbs = [] 
  lifo = []
  var x = 0 
  var y = 0 
  root = new joint(nodes[0],x,y)
  nodes[0].iteration += 1 
  joints.push(root)
  lifo.push(root)
  while(lifo.length > 0){
	  var last = lifo.shift(); 
	  for (var i=0; i<last.n.edges.length; i++){
		var _edge = last.n.edges[i]
		if (_edge.node.iteration<2){ 
			var _x = last.x + _edge.distance * cos( _edge.angle)  
			var _y = last.y + _edge.distance * sin( _edge.angle) 
			var _joint = new joint(_edge.node, _x, _y)
			var _limb = new limb (last,_joint, _edge.distance, _edge.angle) 
			joints.push(_joint)
			limbs.push(_limb)
			_edge.node.iteration+=1
			lifo.push(_joint)
		}
	  }
  }
  
    translate(width/2,height/2)
	noStroke();
  for (var i = 0;i<joints.length; i++){ 
    fill(joints[i].n.color)
	circle(joints[i].x, joints[i].y, joints[i].r)
  }
  
    for (var i = 0;i<limbs.length; i++){ 
	line(limbs[i].j1.x,limbs[i].j1.y, limbs[i].j2.x, limbs[i].j2.y)
	
	var x1 = limbs[i].j1.x
	var x2 = limbs[i].j2.x
	
	var y1 = limbs[i].j1.y
	var y2 = limbs[i].j2.y
	
    var r1 = limbs[i].j1.r
	var r2 = limbs[i].j2.r
	
	var c1 = limbs[i].j1.n.color 
	var c2 = limbs[i].j2.n.color 
	theta=limbs[i].theta
	

		for (var t=0; t<10; t++){
			var xt1 = lerp(x1,x2, t/10)
			var yt1 = lerp(y1,y2, t/10)
			var rt1 = lerp(r1,r2, t/10)
			
			var xt2 = lerp(x1,x2, (t+1)/10)
			var yt2 = lerp(y1,y2, (t+1)/10)
			var rt2 = lerp(r1,r2, (t+1)/10	)
			

			fill(lerpColor(c1,c2,t/10))
			beginShape(QUAD_STRIP);			
			vertex(xt1+rt1*cos(theta+90),yt1+rt1*sin(theta+90))
			vertex(xt1+rt1*cos(theta-90),yt1+rt1*sin(theta-90))
			vertex(xt2+rt2*cos(theta+90),yt2+rt2*sin(theta+90))
			vertex(xt2+rt2*cos(theta-90),yt2+rt2*sin(theta-90))
			endShape()	
			
		}
  }
  
    for (var i = 0;i<joints.length; i++){ 
    fill(joints[i].n.color)
	circle(joints[i].x, joints[i].y, joints[i].r)
  }
}//end setup 

function draw() {
  
} //end draw 

function node () { 
	this.r = abs(randomGaussian(20,10))
	this.edges =[] 
	this.iteration = 0; 
	this.color = color (randomGaussian(128,45),randomGaussian(128,45),randomGaussian(128,45))  
	}

function joint (node,x,y){
	this.x = x 
	this.y = y 
	this.r = node.r
	this.n = node
} 

function limb (j1, j2, d, theta){
	this.j1 = j1 
	this.j2 = j2 
	this.d = d
	this.theta=theta
} 