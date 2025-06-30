let a = [];
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(20);
  a.push(new Koru({ start: 0, x: width / 2, y: height / 2 }));
  noFill();
}
function draw() {
  a.forEach((koru) => koru.draw());
}
class Koru {
  constructor({ start, x, y }) {
    this.start = start;
    this.percentage = 0;
    this.origin = createVector(x, y);
    this.color = random() < 0.1 ? "#FFF" : `#${floor(random(9))}00`;
    this.rotation = random(TWO_PI);
    this.strokeWeight = random(30, 50);
    this.size = random(100, 150);
  }
  draw() {
    if (this.percentage === 1.25) return;
    beginShape();
    push();
    translate(this.origin.x, this.origin.y);
    rotate(this.rotation);
    stroke(this.color);
    strokeWeight(this.strokeWeight);
    this.percentage = min(1.25, (frameCount - this.start) / 50);
    line(
      this.size,
      -width,
      this.size,
      min(0, -400 * (1 - this.percentage * 4))
    );
    if (this.percentage > 0.25) {
      for (let i = 0; i < this.percentage - 0.25; i += 0.01) {
        let scale = map(i, 0, 1, this.size, 0);
        let theta = i * TWO_PI * 2;
        vertex(cos(theta) * scale, sin(theta) * scale);
      }
    }
    endShape();
    pop();
  }
}
function mouseClicked() {
  a.push(new Koru({ start: frameCount, x: mouseX, y: mouseY }));
}
