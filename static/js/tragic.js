const lyrics = [
  "my mind nested",
  "tragic ",
  "as them shots with pac thru em",
  "hell time",
  "new biz",
  "power of a zoom lens",
  "hope god's wombing",
  "vigil viewing",
  "nazi amusement",
  "Columbine shooting",
  "race stunted",
  "depressed",
  "raped women",
  "TWA Flight 800",
  "golden gate",
  "afterlife",
  "passion",
  "after Christ",
  "Jim Caroll",
  "dragon chase",
  "Lil Yummy",
  "all is life",
  "AIDS epidemic",
  "Atlanta child murders",
  "litter at lake Tookies",
  "unchained sentence",
  "black man's mindstate",
  "inner city crime rate",
  "religion about face",
  "the wicked living outbreak",
  "Trump winning",
  "Cosby lust women",
  "Ghandi loves children",
  "government drugs filled in",
  "Brian Pillman",
  "Mind unhinged",
  "rest in peace Selena",
  "i killed my friend",
  "Malcom X achievements",
  "uneven",
  "Nancy Benoit",
  "let's have a family meeting",
  "slave plantation",
  "for nine days",
  "wating for Kanye",
  "Paul Walker on the highway",
];

const width = 1000;
const numOfPoints = 40;
const lineSpacing = 20;
const tau = Math.PI * 2;
const svg = d3
  .create("svg")
  .attr("viewBox", `0, -40, ${width}, ${lyrics.length * lineSpacing + 60}`);

const line = d3.line();

const curve = new Array(numOfPoints)
  .fill(null)
  .map((x, i) => [i * (width / numOfPoints), Math.sin(i) * 10]);

svg
  .selectAll("path")
  .data(lyrics)
  .join("path")
  .attr("d", (d, i) => {
    const shiftedCurve = curve.map(([x, y]) => [x, y + i * lineSpacing]);
    return line(shiftedCurve);
  })
  .attr("stroke", "transparent")
  .attr("fill", "transparent")
  .attr("id", (d) => d.replaceAll(" ", "_"));

svg
  .selectAll("text")
  .data(lyrics)
  .join("text")
  .attr("textLength", "1000px")
  .append("textPath")
  .text((d) => d)
  .attr("xlink:href", (d) => "#" + d.replaceAll(" ", "_"));

const main = document.querySelector("main");
main.innerHTML = `<a href="https://www.youtube.com/watch?v=VW4cX7om8_Q" target="_blank" rel="noopener noreferrer"></a>`;
const link = document.querySelector("a");
link.append(svg.node());

function animate(time) {
  const loopPercent = time / 1000;
  svg
    .selectAll("path")
    .data(lyrics)
    .join("path")
    .attr("d", (d, i) => {
      const shiftedCurve = curve.map(([x, y]) => [
        x,
        y + i * lineSpacing + Math.sin(loopPercent + x) * 20,
      ]);
      return line(shiftedCurve);
    });
  window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);