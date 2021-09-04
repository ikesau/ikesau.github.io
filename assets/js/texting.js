let messageContainer;
let quotes;
const responses = [
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
];
function preload() {
  quotes = loadJSON("assets/json/t_kjv_strings.json");
}
function setup() {
  quotes = Object.values(quotes);
  messageContainer = createDiv();
  messageContainer.class("message-container");
}
let responsesCopy = [...responses];
function getRandomResponse() {
  const index = floor(random(responsesCopy.length));
  const response = responsesCopy[index];
  responsesCopy.splice(index, 1);
  if (responsesCopy.length === 0) {
    responsesCopy = [...responses];
  }
  return response;
}
function draw() {
  const position = random() > 0.5 ? "message-left" : "message-right";
  const children = messageContainer.child();
  const lastChild = children[children.length - 1];
  const isResponse =
    lastChild && !lastChild.classList.contains(position) && random() < 0.5;
  const message = isResponse ? getRandomResponse() : random(quotes);
  const messageDiv = createDiv(message);
  messageDiv.parent(messageContainer);
  messageDiv.addClass("message");
  messageDiv.addClass(position);
  if (random() < 0.3 && !isResponse) {
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
    window.innerHeight + window.scrollY + height + margin >=
    document.body.scrollHeight
  ) {
    messageDiv.elt.scrollIntoView({ behavior: "smooth" });
  }
  frameRate(random(0.1, 0.5));
}
