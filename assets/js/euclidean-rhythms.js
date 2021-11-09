let patterns = [];
let rate = 10;
let controlsContainer;
let addNewPatternButton;
const colours = [
  "#f94144",
  "#f3722c",
  "#f8961e",
  "#f9844a",
  "#f9c74f",
  "#90be6d",
  "#43aa8b",
  "#4d908e",
  "#577590",
  "#277da1",
];
function* generateColour() {
  let copy = [...colours];
  while (true) {
    if (copy.length) {
      yield copy.splice(Math.floor(Math.random() * copy.length), 1)[0];
    } else {
      copy = [...colours];
    }
  }
}
const colourGenerator = generateColour();
const notes = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
];
let noteBank = {};
class Pattern {
  constructor(on, off, rotation = 0) {
    this.on = on;
    this.off = off;
    this.isMuted = false;
    this.rotation = rotation;
    this.sequence = modulatePattern(bjorklund(on, off), rotation);
    this.note = notes[(on + off) % notes.length];
    this.colour = colourGenerator.next().value;
    this.onSlider = createSlider(1, 10, on, 1);
    this.offSlider = createSlider(1, 10, off, 1);
    this.rotationSlider = createSlider(1, 10, off, 1);
    this.noteSlider = createSlider(
      0,
      notes.length - 1,
      (on + off) % notes.length,
      1
    );
    let controls = createDiv();
    controls.class(`controls color-${this.colour.slice(1)}`);
    controls.style("border-color", `${this.colour}`);
    controls.style("color", `${this.colour}`);
    this.onSlider.parent(controls);
    this.offSlider.parent(controls);
    this.rotationSlider.parent(controls);
    this.noteSlider.parent(controls);
    this.buttonContainer = createDiv();
    this.buttonContainer.class("button-container");
    this.buttonContainer.parent(controls);
    this.muteButton = createButton("mute");
    this.muteButton.class("pattern-control-button");
    this.muteButton.mousePressed(() => {
      this.setIsMuted();
      this.muteButton.html(this.isMuted ? "unmute" : "mute");
    });
    this.muteButton.parent(this.buttonContainer);
    this.removeButton = createButton("remove");
    this.removeButton.class("pattern-control-button");
    this.removeButton.mousePressed(() => {
      const selfIndex = patterns.findIndex((x) => x === this);
      patterns.splice(selfIndex, 1);
      controls.remove();
    });
    this.removeButton.parent(this.buttonContainer);
    controls.parent(controlsContainer);
  }
  setRotation(amount) {
    this.rotation = amount;
  }
  setOn(amount) {
    this.on = amount;
  }
  setOff(amount) {
    this.off = amount;
  }
  setIsMuted(isMuted = !this.isMuted) {
    this.isMuted = isMuted;
  }
  getSequence() {
    this.setOn(Number(this.onSlider.value()));
    this.setOff(Number(this.offSlider.value()));
    this.setRotation(Number(this.rotationSlider.value()));
    return modulatePattern(bjorklund(this.on, this.off), this.rotation);
  }
  getNote() {
    return notes[Number(this.noteSlider.value())];
  }
  getLength() {
    return this.on + this.off;
  }
}
function preload() {
  soundFormats("mp3");
  notes.forEach((note) => {
    noteBank[note] = loadSound(`assets/audio/euclidean-rhythms/${note}`);
  });
}
function setup() {
  userStartAudio();
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  controlsContainer = createDiv();
  controlsContainer.class("controls-container");
  addNewPatternButton = createButton("+");
  addNewPatternButton.class("add-new-button");
  addNewPatternButton.mousePressed(() =>
    patterns.push(new Pattern(floor(random(1, 5)), floor(random(1, 5))))
  );
  addNewPatternButton.style("order", "1");
  addNewPatternButton.parent(controlsContainer);
  const tempoSlider = createSlider(5, 20, 10, 1);
  tempoSlider.mouseReleased(() => {
    rate = 25 - Number(tempoSlider.value());
  });
  tempoSlider.parent(controlsContainer);
  patterns.push(new Pattern(floor(random(1, 5)), floor(random(1, 5))));
  background(0);
  noFill();
}
let beats = [];
function draw() {
  background(0, 50);
  translate(width / 2, height / 2);
  patterns.forEach((pattern, i) => {
    stroke(pattern.colour);
    const length = pattern.getLength();
    const note = pattern.getNote();
    const sequence = pattern.getSequence();
    const radius = (i + 1) * 75;
    const beat = (frameCount / rate) % length;
    if (sequence[beat] === "1" && !pattern.isMuted) {
      noteBank[note].play();
    }
    if (!pattern.isMuted) {
      noFill();
      beginShape();
      for (let i = 0; i < length; i++) {
        if (sequence[i] === "1") {
          vertex(
            cos((i / length) * TWO_PI) * radius,
            sin((i / length) * TWO_PI) * radius
          );
        }
      }
      endShape(CLOSE);
    }
    for (let i = 0; i < length; i++) {
      let position = createVector(1, 0);
      position.mult(radius);
      position.rotate((i / length) * TWO_PI);
      let size =
        sequence[i] === "0" || pattern.isMuted ? 4 : beat === i ? 20 : 10;
      fill(pattern.colour);
      ellipse(position.x, position.y, size);
    }
  });
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function bjorklund(on, off) {
  let pattern = new Array(on).fill("1").concat(new Array(off).fill("0"));
  let indexOfDiff;
  while (indexOfDiff != -1) {
    let remainder = pattern.splice(indexOfDiff);
    pattern = pattern
      .map((sequence, i) => sequence + (remainder[i] || ""))
      .concat(remainder.slice(indexOfDiff));
    indexOfDiff = pattern.findIndex((sequence) => sequence != pattern[0]);
  }
  return pattern.join("");
}
function modulatePattern(pattern, amount = 1) {
  return pattern.slice(-amount) + pattern.slice(0, -amount);
}
