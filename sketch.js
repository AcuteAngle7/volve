function setup() {
  angleMode (DEGREES)
  colorMode(RGB)
  
  createCanvas(1000, 500)
  _green = color(154,205,50)
  _blue = color (106,90,205)
  _gray = color (220,220,220)
  //noStroke()
  noFill()
  
  genGeology()
  
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
  

  
  
  //drawCreature() 

}//end setup 

function draw() {
  
} //end draw 

function genGeology(){
	parallels = []
	divisions = [] 
	heights = [] 
	
	translate(0, height/2) 
	strokeWeight(5)

	for(var i=-5; i<=50; i++){
		parallels.push(asin(i/5)) ;
	}
	parallels[5] = 0 
	
	for(var i=0; i<parallels.length; i++){
		var d =  5 - abs ( sin(parallels[i])*5) 
		divisions[i] = []
		heights[i] = [] 
		if (abs(parallels[i]) == 90)
			{
			divisions[i].push(0)
			heights[i].push(random(-1.2,1.1))
			}
		for(var j=0; j<d;j++){
			divisions[i].push(j/d*360)
			heights[i][j] = random(-1.2,1.1)
		}
		divisions[i].push(360)
		heights[i].push ( heights[i][0] )
	}
	
	noStroke(); 
	for (var lat = -90; lat<90; lat+=1){
		for (var lon =0; lon<360; lon+=1){
			for(var i=0; i<parallels.length; i++){
				if (parallels[i] > lat) {
					var south = i;
					var north = i-1;
					break						
				}
			}
			for (var j=0; j<divisions[south].length;j++){
				if (divisions[south][j] > lon) {
					var southeast = j;
					var southwest = j-1; 
					break						
				}
			}
			
			for (var k=0; k<divisions[north].length;k++){
				if (divisions[north][k] > lon) {
					var northeast = k;
					var northwest = k-1; 
					break						
				}
			}
	
			dsouth = map(lon, divisions[south][southwest],divisions[south][southeast],0,1) 		
			var southern = lerp(heights[south][southwest], heights[south][southeast],dsouth)
			
			dnorth = map(lon, divisions[north][northwest],divisions[north][northeast],0,1) 
			var northern = lerp(heights[north][northwest], heights[north][northeast],dnorth)
			
			var dlat = map(lat,parallels[north],parallels[south],0,1)  
			var terrain = lerp(northern, southern, dlat)
			if (terrain > 0.8){fill(_gray)} 
				else if (terrain > 0.0){fill(_green)}
				else {fill(_blue)}
				
			var rho = 90 - lat 
			var theta = lon 
			var x = rho * sin(theta) 
			var y = -1 * rho * cos(theta) 
			
			rect(lon*2,lat*4,2,4)
			
		}
	}  
	
	
}

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

function drawCreature(){
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
}