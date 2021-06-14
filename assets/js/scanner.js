function setup() {
    createCanvas(windowWidth, windowHeight);
    stroke(random(255), random(255), random(255));
    strokeWeight(0.1);
}
function draw() {
    background(255, 10);
    drawGrid(width / 4, sin(frameCount * 0.06) * (height / 5) + height / 4, width - width / 4, height - sin(frameCount * 0.05) * (height / 5) - height / 4);
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
let nestedDrawCount = 0;
function drawGrid(x1, y1, x2, y2, depth = 0) {
    if (depth >= 1 || (depth < 1 && random() < 0.2))
        return;
    const columnsAmount = floor(random(2, 8));
    const rowsAmount = floor(random(2, 8));
    const width = x2 - x1;
    const height = y2 - y1;
    const spaceBetweenColumns = width / columnsAmount;
    const spaceBetweenRows = height / rowsAmount;
    push();
    translate(x1, y1);
    for (let i = 0; i < columnsAmount; i++) {
        line(i * spaceBetweenColumns, 0, i * spaceBetweenColumns, height);
        for (let j = 0; j < rowsAmount; j++) {
            line(0, j * spaceBetweenRows, width, j * spaceBetweenRows);
            drawGrid(i * spaceBetweenColumns, j * spaceBetweenRows, i * spaceBetweenColumns + spaceBetweenColumns, j * spaceBetweenRows + spaceBetweenRows, depth + 1);
        }
    }
    line(width, 0, width, height);
    line(0, height, width, height);
    pop();
}
//# sourceMappingURL=../sketch/sketch/build.js.map