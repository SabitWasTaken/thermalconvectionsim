let balls = [];
let canvasWidth = 800;
let canvasHeight = 600;
let numBalls = 30;
let maxShakiness = 5;
let startButton, restartButton, radiusSlider;
let frozen = true;
let r = 20;
function setup() {
  createCanvas(canvasWidth, canvasHeight);
  
  // Create start button
  startButton = createButton('Start Simulation');
  startButton.position(10, 10);
  startButton.mousePressed(startSimulation);

  // Create restart button
  restartButton = createButton('Restart Simulation');
  restartButton.position(10, 40);
  restartButton.mousePressed(restartSimulation);
  
  

  // Create balls with random initial positions, directions, and shakiness
  for (let i = 0; i < numBalls; i++) {
    let ball = new Ball(random(width - 1.1 * r), random(height - 1.1 * r), r);
    ball.speedX = random(-2, 2);
    ball.speedY = random(-2, 2);
    ball.shakiness = (ball.x < width / 2) ? maxShakiness : 0;
    balls.push(ball);
  }
}

function draw() {
  background(360);

  if (!frozen) {
    // Update and display each ball
    for (let i = 0; i < balls.length; i++) {
      balls[i].update();
      balls[i].checkEdges();

      // Check for collisions with other balls
      for (let j = i + 1; j < balls.length; j++) {
        if (balls[i].intersects(balls[j])) {
          balls[i].collide(balls[j]);
        }
      }
    }
  }
  //display the ballz
    for (let i = 0; i < balls.length; i++) {
      balls[i].display();
    }
}

function startSimulation() {
  frozen = false;
}

function restartSimulation() {
  frozen = true;
  // Reset balls to their initial positions and shakiness
  for (let i = 0; i < balls.length; i++) {
    balls[i].x = random(width);
    balls[i].y = random(height);
    balls[i].speedX = random(-5, 5);
    balls[i].speedY = random(-5, 5);
    balls[i].shakiness = (balls[i].x < width / 2) ? maxShakiness : 0;
  }
}

class Ball {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speedX = 0;
    this.speedY = 0;
    this.shakiness = 0;
    this.shakeFactor = 1; // Adjust the intensity of shaking
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  display() {
    // Ensure shakiness is within valid range
    this.shakiness = constrain(this.shakiness, 0, maxShakiness);
    // Set color based on shakiness
    let colorShakiness = map(this.shakiness, 0, maxShakiness, 0, 255);
    fill(colorShakiness, 0, 255 - colorShakiness);

    // Add random displacement based on shakiness
    let shakeX = random(-this.shakiness * this.shakeFactor, this.shakiness * this.shakeFactor);
    let shakeY = random(-this.shakiness * this.shakeFactor, this.shakiness * this.shakeFactor);
    ellipse(this.x + shakeX, this.y + shakeY, this.radius * 2);
    fill(360);
    textSize(25)
    let temp = round(this.shakiness * 20);
    text(temp, this.x + shakeX - 13, this.y + shakeY + r * 0.5)
  }

  checkEdges() {
    if (this.x + this.radius >= width || this.x - this.radius <= 0) {
      this.speedX *= -1;
      // Move the ball inside the canvas
      this.x = constrain(this.x, this.radius, width - this.radius);
    }
    if (this.y + this.radius >= height || this.y - this.radius <= 0) {
      this.speedY *= -1;
      // Move the ball inside the canvas
      this.y = constrain(this.y, this.radius, height - this.radius);
    }
  }

  intersects(other) {
    let dx = this.x - other.x;
    let dy = this.y - other.y;
    let distance = sqrt(dx * dx + dy * dy);
    return distance < this.radius + other.radius;
  }

  collide(other) {
    // Calculate the vector between the two balls
    let dx = other.x - this.x;
    let dy = other.y - this.y;
    let distance = sqrt(dx * dx + dy * dy);

    // Calculate the minimum translation distance
    let minTransDist = (this.radius + other.radius) - distance;
    let transX = (minTransDist / distance) * dx;
    let transY = (minTransDist / distance) * dy;

    // Move the balls away from each other
    this.x -= transX / 2;
    this.y -= transY / 2;
    other.x += transX / 2;
    other.y += transY / 2;

    // Swap speeds to simulate collision
    let tempSpeedX = this.speedX;
    let tempSpeedY = this.speedY;
    this.speedX = other.speedX;
    this.speedY = other.speedY;
    other.speedX = tempSpeedX;
    other.speedY = tempSpeedY;

    // Update shakiness as the average of both balls
    let avgShakiness = (this.shakiness + other.shakiness) / 2;
    this.shakiness = avgShakiness;
    other.shakiness = avgShakiness;
  }
}
