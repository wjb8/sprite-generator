function setup() {
  let canvasSize = 1000;
  createCanvas(canvasSize, canvasSize);
  let scaleFactor = 10; //for resizing up;
  let spriteSize = 10; //in pixels, one side of the square image
  let padding = 10; //in pixels, between each image
  let numSprites = floor(canvasSize / ((spriteSize + padding) * scaleFactor)); //sets number of sprites based on how many can fit

  canvasSize =
    numSprites * (spriteSize + padding) * scaleFactor + padding * scaleFactor;
  resizeCanvas(canvasSize, canvasSize); //sets the actual canvas size to fit perfectly (poorly)

  background(0);
  frameRate(1);

  function writeColor(image, x, y, red, green, blue, alpha) {
    let index = (x + y * image.width) * 4;

    image.pixels[index] = red;

    image.pixels[index + 1] = green;

    image.pixels[index + 2] = blue;

    image.pixels[index + 3] = alpha;
  }

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
      let color1 = [random(255), random(255), random(255)]; //set an initial random color for the sprite

      for (y = 0; y < img.height; y++) {
        color1 = [random(255), random(255), random(255)]; //sets a new color for the row

        for (x = 0; x < img.width / 2; x++) {
          // color1 = [random(255), random(255), random(255)]; //sets a new color at the pixel level

          let red = color1[0];

          let green = color1[1];

          let blue = color1[2];

          let alpha = random(0, 255);

          writeColor(img, x, y, red, green, blue, alpha);
          writeColor(img, img.width - x - 1, y, red, green, blue, alpha); //-1?
        }
      }

      img.updatePixels();

      // img.resize(spriteSize * scaleFactor, spriteSize * scaleFactor);

      img.resizeNN(spriteSize * scaleFactor, spriteSize * scaleFactor); //nearest neighbour resize to scale up without interpolation

      image(img, padding * scaleFactor + i, padding * scaleFactor + u);
    }
  }
}

function draw() {}
