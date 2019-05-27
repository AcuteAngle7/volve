function setup() {
  angleMode (DEGREES)
  colorMode(RGB)
  createCanvas(1200, 1000)
  frameRate(1)
  
  tree = {
	  name: "tree",
	  type: "plant", 
	  population: 1, 
	  size: 1,
	  water: 0, 
	  sun: 0 
  } 
  
   horse = {
	  name: "horse", 
	  type: "herbivore", 
	  population: 1, 
	  size: 1,
	  speed: 1,
	  food: 0, 
	  water: 0
  } 
  
   tiger = {
	  name: "tiger", 
	  type: "carnivore", 
	  population: 1, 
	  size: 1,
	  speed: 1,
	  food: 0, 
	  water: 0
  } 
  
  species = [tree, horse, tiger]
   
  phase = "spawn" 
   
  var water, sun 

  
}//end setup 

function draw() {  

console.log(phase)

	if (phase == "spawn"){
		water = floor(randomGaussian(10,5))
		sun = floor(randomGaussian(10,5))
		
		for (var specie of species){
			specie.population += 1
		}
		
		phase = "feed" 
	} 

	else if (phase == "feed"){
		water -=1 
		sun -=1 
		if (sun <= 0 || water <= 0) { phase = "cull"} 
	} 
	
	else if (phase == "cull"){
		phase = "spawn"
	} 

for (var specie of species){
			console.log(specie.name, specie.population)
	} 
console.log(water, sun)


} //end draw 
