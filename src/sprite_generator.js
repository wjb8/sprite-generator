function setup() {
	
	// --------VARIABLES------------
	
	let canvasSize = 800;
	let scaleFactor = 4; //for resizing up;
	let spriteSize = 13; //in pixels, one side of the square image
	let padding = 4; //in pixels, between each image
	let multiBackground = false; // multicolor background for testing colors. otherwise, just black.
	let color1 = [random(255), random(255), random(255)]; // set an initial random color
	
	let isSymmetrical = true; // vertical symmetry
	
	// 1-in-x chance of a new color. 0 = never a new color, 1 = new color every time
	let spriteColorVariation = 1;
	let rowColorVariation = 10; 
	let individualPixelVariation = 15;
	
	// multiplies each pixel color value by this amount
	let redScale = 0.99;
	let grnScale = 1.01;
	let bluScale = 1.01;
	
	// if new colors ARE random:
	// this always alters every individual pixel color by this amount, (randomly up or down)
	// if new colors ARE NOT random:
	// new colors will change by this much from the previous color. (more subtle changes)
	let newColorsAreRandom = false;
	let colorVariationAmount = 10;
	
	// this overrides "newColorsAreRandom = false" just for new random colors per sprite
	let newSpriteColorsAreRandom = true; 
	
	let alphaVariation = 10; // 1-in-x chance of a new alpha value. 0 = never, 1 = always
	let alphaDepth = 40; //lower range of possible values. max 255 = no alpha
	let zeroAlpha = 2; // 1-in-x chance to allow some pixels to be zero alpha. 
	
	// 1-in-x chance of a variation. 0 = all sprites are consistent, 1 = new values every sprite
	let spriteVariation = 0;
	let spriteVariationAmount = 0.075;
	let changeSymmetry = false; // if you want a chance to be asymmetrical
	let changeRandom = false; // if you want a chance to change "newColorsAreRandom"
	
	//-----------CANVAS SETUP-----------------
	
	createCanvas(canvasSize, canvasSize);
	let numSprites = floor(canvasSize / ((spriteSize + padding) * scaleFactor)); //sets number of sprites based on how many can fit
	canvasSize = numSprites * (spriteSize + padding) * scaleFactor + padding * scaleFactor;
	resizeCanvas(canvasSize, canvasSize); //sets the actual canvas size to fit perfectly (poorly)
	let spriteWidth = spriteSize; // this is for turning on & off symmetry 
	background(0);
	noStroke();
	if (multiBackground) {
		fill(255);
		rect(0,0,canvasSize/2,canvasSize/2);
		fill(30);
		rect(0,canvasSize/2,canvasSize/2,canvasSize/2);
		fill(125);
		rect(canvasSize/2,0,canvasSize/2,canvasSize/2);
	}
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
			
			let img = createImage(spriteSize, spriteSize);
			img.loadPixels();
			
			let x, y; //for iterating through the pixel array
			
			if ( randChance(spriteColorVariation) ) { // sets a new sprite color
				
				if (newColorsAreRandom || newSpriteColorsAreRandom) {
					color1 = [random(255), random(255), random(255)]; 
					} else {
					color1[0] += random(-colorVariationAmount, colorVariationAmount);					
					color1[1] += random(-colorVariationAmount, colorVariationAmount);	
					color1[2] += random(-colorVariationAmount, colorVariationAmount);					
				}
				
			}
			
			let alpha = random(alphaDepth, 255); // initial alpha
			
			for (y = 0; y < img.height; y++) {
				
				if ( randChance(rowColorVariation) ) {  // sets a new color for the row
					
					if (newColorsAreRandom) {
						color1 = [random(255), random(255), random(255)]; 
						} else {
						color1[0] += random(-colorVariationAmount, colorVariationAmount);					
						color1[1] += random(-colorVariationAmount, colorVariationAmount);	
						color1[2] += random(-colorVariationAmount, colorVariationAmount);
					}
					
					
				}
				
				if ( isSymmetrical) {
					spriteWidth = img.width / 2;
					} else {
					spriteWidth = img.width;
				}
				
				for (x = 0; x < spriteWidth; x++) {
					
					if ( randChance(individualPixelVariation) ){ //sets a new color at the pixel level
						
						if (newColorsAreRandom){
							color1 = [random(255), random(255), random(255)]; 
							} else {
							color1[0] += random(-colorVariationAmount, colorVariationAmount);					
							color1[1] += random(-colorVariationAmount, colorVariationAmount);	
							color1[2] += random(-colorVariationAmount, colorVariationAmount);
						}
					}
					
					let red = color1[0];
					let green = color1[1];
					let blue = color1[2];
					
					let alphaScale = 1 // for zeroing out the alpha value while retaining the previous value
					
					color1[0] *= redScale;
					color1[1] *= grnScale;
					color1[2] *= bluScale;
					
					if (newColorsAreRandom){
						color1[0] += random(-colorVariationAmount, colorVariationAmount);					
						color1[1] += random(-colorVariationAmount, colorVariationAmount);	
						color1[2] += random(-colorVariationAmount, colorVariationAmount);
					}
					
					if ( randChance(alphaVariation) ) {alpha = random(alphaDepth, 255);}
					if ( randChance(zeroAlpha) ){ alphaScale = 0; }
					
					writeColor(img, x, y, red, green, blue, alpha * alphaScale);
					if ( isSymmetrical) { writeColor(img, img.width - x - 1, y, red, green, blue, alpha * alphaScale); }
				}
				
			}
			
			img.updatePixels();
			
			img.resizeNN(spriteSize * scaleFactor, spriteSize * scaleFactor); //nearest neighbour resize to scale up without interpolation
			
			image(img, padding * scaleFactor + i, padding * scaleFactor + u);
			
			if ( randChance(spriteVariation) ) {				
				if ( randChance(spriteVariation) && changeSymmetry) {isSymmetrical = !isSymmetrical;}
				if ( randChance(spriteVariation) && changeRandom) {newColorsAreRandom = !newColorsAreRandom;}
				rowColorVariation += random(-spriteVariationAmount, spriteVariationAmount); 
				individualPixelVariation += random(-spriteVariationAmount, spriteVariationAmount);
				colorVariationAmount += random(-spriteVariationAmount, spriteVariationAmount); 
				alphaDepth += random(-spriteVariationAmount, spriteVariationAmount);
				zeroAlpha += random(-spriteVariationAmount, spriteVariationAmount);	
				redScale += random(-spriteVariationAmount, spriteVariationAmount);	
				grnScale += random(-spriteVariationAmount, spriteVariationAmount);	
				bluScale += random(-spriteVariationAmount, spriteVariationAmount);
				alphaVariation += random(-spriteVariationAmount, spriteVariationAmount);
				spriteColorVariation += random(-spriteVariationAmount, spriteVariationAmount);
			}
			
		}
	}
}

function draw() {}

function keyPressed() {
	if (key == 's' || key == 'S') {
		saveCanvas("output", 'png');
	}
}