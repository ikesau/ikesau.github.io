const palette = [
  "#2b2821",
  "#624c3c",
  "#d9ac8b",
  "#e3cfb4",
  "#243d5c",
  "#5d7275",
  "#5c8b93",
  "#b1a58d",
  "#b03a48",
  "#d4804d",
  "#e0c872",
  "#3e6958",
];
function checkIsElementCheckbox(element) {
  return Boolean(element.checked);
}
let newButton;
let paramInputs = {};
let seeds = {};
function createParamSlider(begin = 0, end = 10, init = 0, step = 0.1) {
  const slider = createSlider(begin, end, init, step);
  slider.changed(() => {
    redraw();
  });
  return slider;
}
function createParamCheckbox(defaultValue = true) {
  const checkbox = createCheckbox("", defaultValue);
  checkbox.changed(() => {
    redraw();
  });
  return checkbox;
}
function setup() {
  paramInputs.scale = createParamSlider(4, 20, 10, 1);
  paramInputs.colourSeed = createParamSlider(0, 20, 0, 1);
  paramInputs.circles = createParamSlider(0, 5, 1, 1);
  paramInputs.blocks = createParamSlider(0, 5, 0, 1);
  paramInputs.dotClusters = createParamSlider(0, 5, 2, 1);
  paramInputs.spokes = createParamSlider(0, 10, 10, 1);
  paramInputs.border = createParamCheckbox(true);
  paramInputs.centerCircle = createParamCheckbox(true);
  let togglePanelButton = createButton("Hide parameters");
  togglePanelButton.style(`
    margin-top: 8px;
    margin-left: 32px;
    position: absolute;
    top: 0;
    z-index: 1;
  `);
  let uiContainer = createDiv();
  uiContainer.style("position", "absolute");
  uiContainer.style("top", "0");
  uiContainer.style("left", "0");
  let paramInputsContainer = createDiv();
  paramInputsContainer.parent(uiContainer);
  let isParamInputsContainerVisible = true;
  togglePanelButton.mousePressed(() => {
    paramInputsContainer.style(
      "visibility",
      isParamInputsContainerVisible ? "hidden" : "visible"
    );
    togglePanelButton.html(
      `${isParamInputsContainerVisible ? "Show" : "Hide "} parameters`
    );
    isParamInputsContainerVisible = !isParamInputsContainerVisible;
  });
  paramInputsContainer.style(`
    display: flex;
    height: 100vh;
    position: absolute;
    flex-direction: column;
    padding: 32px;
    background: #fff;
`);
  Object.keys(paramInputs).forEach((key) => {
    seeds[key] = 0;
    const slider = paramInputs[key];
    const label = createSpan(key);
    label.parent(paramInputsContainer);
    slider.parent(paramInputsContainer);
    slider.style("margin-bottom", "24px");
    slider.id(`${key}Slider`);
  });
  newButton = createButton("New pattern");
  newButton.mouseClicked(() => {
    noiseSeed(random() * 1000);
    redraw();
  });
  newButton.parent(paramInputsContainer);
  noLoop();
  createCanvas(windowWidth, windowHeight);
  noStroke();
}
function draw() {
  background(255);
  translate(width / 2, height / 2);
  scale(Number(paramInputs.scale.value()));
  rugQuarter();
  applyMatrix(-1, 0, 0, 1, 0, 0);
  rugQuarter();
  applyMatrix(-1, 0, 0, -1, 0, 0);
  rugQuarter();
  applyMatrix(-1, 0, 0, 1, 0, 0);
  rugQuarter();
}
function rugQuarter() {
  Object.keys(paramInputs).forEach((key) => {
    seeds[key] = 0;
  });
  let colourSeed = Number(paramInputs.colourSeed.value());
  let scaleValue = Number(paramInputs.scale.value());
  let width = windowWidth / scaleValue / 4;
  let height = windowHeight / scaleValue / 4;
  function getSeededColour() {
    let colour = palette[Math.floor(noise(colourSeed) * palette.length)];
    colourSeed++;
    return colour;
  }
  function getSeededCoordinate(param) {
    let x = Math.floor(noise(seeds[param]) * width);
    seeds[param]++;
    let y = Math.floor(noise(seeds[param]) * height);
    seeds[param]++;
    return createVector(x, y);
  }
  function getSeededHeight(param) {
    let y = Math.floor(noise(seeds[param]) * height);
    seeds[param]++;
    return y;
  }
  function getSeededSlope(param) {
    const slopes = [4, 3, 2, 1.5, 1, 1 / 2, 1 / 3, 1 / 4];
    let slope = slopes[floor(noise(seeds[param]) * slopes.length)];
    seeds[param] += 1;
    return slope;
  }
  function sprinkleDots(amount = width * 2) {
    fill(getSeededColour());
    for (let i = 0; i <= amount; i++) {
      let { x, y } = getSeededCoordinate("dotClusters");
      rect(x, y, 1, 1);
    }
  }
  function drawBlock() {
    fill(getSeededColour());
    let { x, y } = getSeededCoordinate("blocks");
    let value = getSeededHeight("blocks");
    x = max(0, x - value);
    y = max(0, y - value);
    rect(x, y, value, value);
  }
  function drawSpoke() {
    fill(getSeededColour());
    const slope = getSeededSlope("spokes");
    for (let i = 0; i <= 10; i++) {
      let value = getSeededHeight("spokes");
      rect(min([width - 1, value]), min([height - 1, value * slope]), 1, 1);
    }
  }
  function drawBorder() {
    fill(getSeededColour());
    let { x, y } = getSeededCoordinate("border");
    for (let i = 0; i <= x; i++) {
      rect(min(width - 1, i * floor(width / x)), height - 1, 1, 1);
    }
    for (let i = 0; i <= y; i++) {
      rect(width - 1, min(height - 1, i * floor(height / y)), 1, 1);
    }
  }
  function drawCircle(coords) {
    fill(getSeededColour());
    let { x, y } = coords || getSeededCoordinate("circles");
    let radius = min(
      min(getSeededHeight("circles"), height - y - 5),
      width - x - 5
    );
    push();
    translate(x, y);
    for (let i = 0; i <= TWO_PI; i += PI / 32) {
      for (let j = 0; j <= radius; j++) {
        let curX = floor(cos(i) * j);
        let curY = floor(sin(i) * j);
        rect(curX, curY, 1, 1);
      }
    }
    pop();
  }
  fill(getSeededColour());
  rect(0, 0, width, height);
  for (let i = 1; i <= Number(paramInputs.circles.value()); i++) {
    drawCircle();
  }
  for (let i = 1; i <= Number(paramInputs.blocks.value()); i++) {
    drawBlock();
  }
  for (let i = 1; i <= Number(paramInputs.dotClusters.value()); i++) {
    sprinkleDots();
  }
  for (let i = 1; i <= Number(paramInputs.spokes.value()); i++) {
    drawSpoke();
  }
  if (
    checkIsElementCheckbox(paramInputs.border) &&
    paramInputs.border.checked()
  ) {
    drawBorder();
  }
  if (
    checkIsElementCheckbox(paramInputs.centerCircle) &&
    paramInputs.centerCircle.checked()
  ) {
    drawCircle(createVector(0, 0));
  }
}
//# sourceMappingURL=../sketch/sketch/build.js.map
