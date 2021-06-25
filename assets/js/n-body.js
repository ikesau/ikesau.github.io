let particles = [];
class Particle {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
    }
    attract(vector) {
        this.acceleration
            .set(p5.Vector.sub(createVector(vector.x, vector.y), this.pos))
            .limit(0.005);
        this.velocity.add(this.acceleration).limit(1);
        this.pos.add(this.velocity);
        this.pos.set(this.pos.x < 0 ? width - this.pos.x : this.pos.x % width, this.pos.y < 0 ? height - this.pos.y : this.pos.y % height);
    }
    draw() {
        let from = color(0, 0, 100);
        let to = color(255, 0, 100);
        fill(lerpColor(from, to, this.velocity.mag()));
        ellipse(this.pos.x, this.pos.y, 20);
    }
}
function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    background("#060006");
    frameRate(200);
}
function draw() {
    background(0, 20);
    particles.forEach((particle) => {
        let others = particles.filter((p) => particle !== p);
        others.forEach((other) => particle.attract(other.pos));
    });
    particles.forEach((particle) => {
        particle.draw();
    });
}
function mouseClicked() {
    particles.push(new Particle(mouseX, mouseY));
}
//# sourceMappingURL=../sketch/sketch/build.js.map