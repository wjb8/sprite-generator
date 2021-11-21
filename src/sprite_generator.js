function setup() {
	
	// --------VARIABLES------------
	
	let canvasSize = 800;
	let scaleFactor = 5; //for resizing up;
	let spriteSize = 7; //in pixels, one side of the square image
	let padding = 7; //in pixels, between each image
	
	let isSymmetrical = true; // vertical symmetry
	
	// 1-in-x chance of a new color. 0 = never a new color, 1 = new color every time
	let rowColorVariation = 10; 
	let individualPixelVariation = 50;
	let colorVariationAmount = 10;
	
	let alphaDepth = 50; //lower range of possible values. max 255 = no alpha
	let zeroAlpha = 6; // 1-in-x chance to allow some pixels to be zero alpha. 
	
	
	// 1-in-x chance of a variation. 0 = all sprites are consistent, 1 = new values every sprite
	let spriteVariation = 0;
	let spriteVariationAmount = 2;
	
	
	createCanvas(canvasSize, canvasSize);
	let numSprites = floor(canvasSize / ((spriteSize + padding) * scaleFactor)); //sets number of sprites based on how many can fit
	canvasSize = numSprites * (spriteSize + padding) * scaleFactor + padding * scaleFactor;
	resizeCanvas(canvasSize, canvasSize); //sets the actual canvas size to fit perfectly (poorly)
	let spriteWidth = spriteSize;
	let color1 = [random(255), random(255), random(255)];
	background(0);
	noStroke();
	fill(255);
	rect(0,0,canvasSize/2,canvasSize/2);
	fill(30);
	rect(0,canvasSize/2,canvasSize/2,canvasSize/2);
	fill(125);
	rect(canvasSize/2,0,canvasSize/2,canvasSize/2);
	frameRate(1);
	
	// --------------FUNCTIONS--------------------
	
	function randChance (x){ 
		if ( ceil( random(x) ) == 1 ) { return true; }
		else { return false; }
	}
	
	function writeColor (image, x, y, red, green, blue, alpha) {
		let index = (x + y * image.width) * 4;
		
		image.pixels[index] = red;
		
		image.pixels[index + 1] = green;
		
		image.pixels[index + 2] = blue;
		
		image.pixels[index + 3] = alpha;
		
	}
	
	//-----------------FOR LOOPS---------------------
	
	for (
		let u = 0;
		u < height - (padding + spriteSize) * scaleFactor;
		u += (spriteSize + padding) * scaleFactor
		) {
		for (
			let i = 0;
			i < width - (padding + spriteSize) * scaleFactor;
			i += (spriteSize + padding) * scaleFactor
			) {
			
			//for each sprite
			
			if ( randChance(spriteVariation) ) {				
				if ( randChance(spriteVariation) ) {isSymmetrical = !isSymmetrical}
				rowColorVariation += random(-spriteVariationAmount, spriteVariationAmount); 
				individualPixelVariation += random(-spriteVariationAmount, spriteVariationAmount);
				colorVariationAmount += random(-spriteVariationAmount, spriteVariationAmount); 
				alphaDepth += random(-spriteVariationAmount, spriteVariationAmount);
				zeroAlpha += random(-spriteVariationAmount, spriteVariationAmount);				
			}			
			
			let img = createImage(spriteSize, spriteSize);
			img.loadPixels();
			
			let x, y; //for iterating through the pixel array
			color1 = [random(255), random(255), random(255)]; //set an initial random color for the sprite
			
			for (y = 0; y < img.height; y++) {
				
				if ( randChance(rowColorVariation) ) { 
					
					color1 = [random(255), random(255), random(255)]; 
					//sets a new color for the row
					
				}
				
				if ( isSymmetrical) {
					spriteWidth = img.width / 2;
					} else {
					spriteWidth = img.width;
				}
				
				for (x = 0; x < spriteWidth; x++) {
					
					if ( randChance(individualPixelVariation) ){
						color1 = [random(255), random(255), random(255)]; //sets a new color at the pixel level
					}
					
					let red = color1[0];
					let green = color1[1];
					let blue = color1[2];
					
					color1[0] += random(-colorVariationAmount, colorVariationAmount);					
					color1[1] += random(-colorVariationAmount, colorVariationAmount);	
					color1[2] += random(-colorVariationAmount, colorVariationAmount);	
					
					let alpha = random(alphaDepth, 255);
					if ( randChance(zeroAlpha) ){ alpha = 0; }
					
					writeColor(img, x, y, red, green, blue, alpha);
					if ( isSymmetrical) { writeColor(img, img.width - x - 1, y, red, green, blue, alpha); }
				}
				
			}
			
			img.updatePixels();
			
			img.resizeNN(spriteSize * scaleFactor, spriteSize * scaleFactor); //nearest neighbour resize to scale up without interpolation
			
			image(img, padding * scaleFactor + i, padding * scaleFactor + u);
			
		}
	}
}

function draw() {}