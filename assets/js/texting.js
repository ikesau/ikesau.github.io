let messageContainer;
let quotes;
const reactions = [
  "lol",
  "fr",
  "bet",
  "totally",
  "yeah",
  "lmao",
  "ahah",
  "hahaha",
  "ahaha",
  "looool",
  "omg",
  "lol yeah",
  "😭",
  "😂",
  "yea",
  "verily",
  "amen",
  "lo",
  "bruh",
];
function preload() {
  quotes = loadJSON("assets/json/t_kjv_strings.json");
}
function setup() {
  noCanvas();
  quotes = Object.values(quotes);
  messageContainer = createDiv();
  messageContainer.class("message-container");
}
let reactionsCopy = [...reactions];
function getRandomReaction() {
  const index = floor(random(reactionsCopy.length));
  const reaction = reactionsCopy[index];
  reactionsCopy.splice(index, 1);
  if (reactionsCopy.length === 0) {
    reactionsCopy = [...reactions];
  }
  return reaction;
}
function draw() {
  const position = random() > 0.5 ? "message-left" : "message-right";
  const children = messageContainer.child();
  const lastChild = children[children.length - 1];
  const isResponse = lastChild && !lastChild.classList.contains(position);
  const shouldReact =
    isResponse &&
    !lastChild.classList.contains("message--is-reaction") &&
    random() < 2 / 5;
  const shouldSpeechBubblify = isResponse || !lastChild;
  const message = shouldReact ? getRandomReaction() : String(random(quotes));
  const messageDiv = createDiv(message);
  messageDiv.parent(messageContainer);
  messageDiv.addClass("message");
  messageDiv.addClass(position);
  shouldReact && messageDiv.addClass("message--is-reaction");
  shouldSpeechBubblify && messageDiv.addClass("message--speech-bubble");
  if (random() < 0.5 && !isResponse) {
    setTimeout(() => {
      messageDiv.addClass("message--react");
      messageDiv.addClass(
        random([
          "message--🙏-react",
          "message--👆-react",
          "message--🥰-react",
          "message--💦-react",
          "message--🥵-react",
          "message--💯-react",
          "message--👏-react",
          "message--🙌-react",
        ])
      );
    }, random(2000, 5000));
  }
  const { height } = messageDiv.size();
  const margin = 64;
  if (
    window.innerHeight + window.scrollY + height * 2 + margin >=
    document.body.scrollHeight
  ) {
    messageDiv.elt.scrollIntoView({ behavior: "smooth" });
  }
  frameRate(random(0.3, 0.5));
}
//# sourceMappingURL=../sketch/sketch/build.js.map
