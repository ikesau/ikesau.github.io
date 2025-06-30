const getWeek = function () {
  var date = new Date(new Date().getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};

const expectedAge = 89;
const birthYear = 1995;

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentWeek = getWeek();

d3.select("main")
  .append("p")
  .text(`${expectedAge + birthYear - currentYear} years to go!`);

const svg = d3.select("body").append("svg");
const width = 520;
const height = expectedAge * 10;
svg.attr("viewBox", `-1,-1,${width + 1},${height + 1}`);

for (let year = 0; year < expectedAge; year++) {
  for (let week = 0; week < 52; week++) {
    const rect = svg.append("rect");
    const fill =
      birthYear + year == currentYear
        ? week < currentWeek
          ? "black"
          : "transparent"
        : birthYear + year < currentYear
        ? "black"
        : "transparent";
    rect.attr("x", week * 10);
    rect.attr("y", year * 10);
    rect.attr("height", 8);
    rect.attr("width", 8);
    rect.attr("stroke", "black");
    rect.attr("fill", fill);
  }
}
