function setup() {
  angleMode (DEGREES)
  colorMode(RGB)
  
  createCanvas(1200, 1000)
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
	var parallels = []
	var divisions = [] 
	var heights = [] 

	for(var h=0; h<6;h++){	

		parallels[h] = []
		divisions[h]= [] 
		heights[h] = [] 

		_scale = 5 * pow(2,h)

		for(var i=-1*_scale; i<=_scale; i+=5){
			parallels[h].push(asin(i/_scale)) ;
		}
		parallels[h][_scale] = 0 
		
		for(var i=0; i<parallels[h].length; i++){
			var d =  _scale - abs ( sin(parallels[h][i])*_scale) 
			divisions[h][i] = []
			heights[h][i] = [] 
			if (abs(parallels[h][i]) == 90)
				{
				divisions[h][i].push(0)
				heights[h][i].push(random(-2,1.7))
				}
			for(var j=0; j<d;j++){
				divisions[h][i].push(j/d*360)
				heights[h][i][j] = random(-2,1.7)
			}
			divisions[h][i].push(360)
			heights[h][i].push ( heights[h][i][0] )
		}
	}
	
	for (var lat = -90; lat<90; lat+=2){
		for (var lon =0; lon<360; lon+=2){
			var terrain = 0 
			
			for (var h=1; h<6; h++){ 
				for(var i=0; i<parallels[h].length; i++){
					if (parallels[h][i] > lat) {
						var south = i;
						var north = i-1;
						break						
					}
				}
				for (var j=0; j<divisions[h][south].length;j++){
					if (divisions[h][south][j] > lon) {
						var southeast = j;
						var southwest = j-1; 
						break						
					}
				}
				
				for (var k=0; k<divisions[h][north].length;k++){
					if (divisions[h][north][k] > lon) {
						var northeast = k;
						var northwest = k-1; 
						break						
					}
				}
		
				dsouth = map(lon, divisions[h][south][southwest],divisions[h][south][southeast],0,1) 		
				var southern = lerp(heights[h][south][southwest], heights[h][south][southeast],dsouth)
				
				dnorth = map(lon, divisions[h][north][northwest],divisions[h][north][northeast],0,1) 
				var northern = lerp(heights[h][north][northwest], heights[h][north][northeast],dnorth)
				
				var dlat = map(lat,parallels[h][north],parallels[h][south],0,1)  
				terrain += lerp(northern, southern, dlat) / pow(2,h)
			} // end for h 		
			
			if (terrain > 0.8){fill(_gray)} 
				else if (terrain > 0.0){fill(_green)}
				else {fill(_blue)}
				
			//rect(lon*2,lat*4,4,8)
			
		} // end lon loop 
	}  // end lat loop 
	
	strokeWeight(5) 
	translate(width/2, height/2) 
		points = [] 
	
	var N = 100; 
	var dlon = PI *(3-sqrt(5))  
	var dz = 2/N
	var lon = 0
	var z = 1 - dz/2
	for (var k=0; k<N-1; k++) {
		var r = sqrt(1-z*z)
		var x = cos(lon/PI*180)*r
		var y= sin(lon/PI*180)*r
		points.push([50*x/(1-z), 50*y/ (1-z)])  
		point(50*x/(1-z), 50*y/ (1-z))
		z = z - dz
		lon += dlon
	}
	
	strokeWeight(1)
	noFill(); 
	delaunay = Delaunator.from(points)
	var triangles = delaunay.triangles
	for (let i = 0; i < triangles.length; i += 3) {
		beginShape()
    
        vertex(points[triangles[i]][0],points[triangles[i]][1])
        vertex(points[triangles[i+1]][0],points[triangles[i+1]][1])
        vertex(points[triangles[i+2]][0],points[triangles[i+2]][1])
       
		endShape(CLOSE);
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