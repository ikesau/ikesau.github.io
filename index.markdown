---
layout: default
---

<div>
  
<style>
    .the-header-of-theseus {
        margin: 32px 0 0 0;
        text-align: center;
        height: 40px;
    }
    .plank {
        margin: 0;
        display: inline;
        font-size: 32px;
    }
</style>
<header class="the-header-of-theseus">
<h1 class="plank">i</h1>
<h1 class="plank">k</h1>
<h1 class="plank">e</h1>
<h1 class="plank">s</h1>
<h1 class="plank">a</h1>
<h1 class="plank">u</h1>
<h1 class="plank">.</h1>
<h1 class="plank">c</h1>
<h1 class="plank">o</h1>
</header>

<script>
    const letters = [...document.querySelectorAll(".plank")]
    const pickRandom = (array) => array[Math.floor(Math.random() * array.length)]
    const systemFonts = [
        "Arial",
        "Helvetica Neue",
        "Helvetica",
        "sans-serif",
        "Georgia",
        "Times New Roman",
        "Times",
        "serif",
        "Consolas",
        "Menlo",
        "Monaco",
        "Lucida Console",
        "Liberation Mono",
        "DejaVu Sans Mono",
        "Bitstream Vera Sans Mono",
        "Courier New",
        "monospace",
    ]

    setInterval(() => {
        const letter = pickRandom(letters);
        if (Math.random() > 0.5) {
        const font = pickRandom(systemFonts);
        letter.style.fontFamily = font
        } else {
            letter.style.textTransform = letter.style.textTransform === "uppercase" ? "" : "uppercase"
        }
    },
     200)
</script>
<h2>hello</h2>
  <ul>
    <li>
      <a
        href="https://github.com/ikesau"
        target="_blank"
        rel="noopener noreferrer"
        >github</a
      >
    </li>
    <li>
      <a
        href="https://twitter.com/ikesau"
        target="_blank"
        rel="noopener noreferrer"
        >twitter</a
      >
    </li>
    <li>
      <a
        href="https://en.wikipedia.org/wiki/Special:Contributions/Ike_Saunders"
        target="_blank"
        rel="noopener noreferrer"
        >wikipedia</a
      >
    </li>
    <li>
      <a
        href="https://observablehq.com/@ikesau"
        target="_blank"
        rel="noopener noreferrer"
        >observable</a
      >
    </li>
    <li><a href="/aotearoa_photos.html">aotearoa photos</a></li>
    <li><a href="/cool_websites.html">other cool websites</a></li>
  </ul>
  <h4>various code sketches</h4>
  <ul class='decorating-vice'>
    <li><a href="/eyes.html">eyes</a></li>
    <li><a href="/life.html">life</a></li>
    <li><a href="/n-body.html">n-body</a></li>
    <li><a href="/pixel-persian.html">pixel persian</a></li>
    <li><a href="/texting.html">texting</a></li>
    <li><a href="/tragic.html">tragic</a></li>
    <li><a href="/euclidean-rhythms.html">euclidean rhythms</a></li>
    <li><a href="/death-calendar.html">death calendar</a></li>
  </ul>
  <h4>other things</h4>
  <ul>
    <li><a href="https://observablehq.com/@ikesau/a-novel-analysis">a novel analysis</a></li>
    <li><a href="https://observablehq.com/@ikesau/learning-french-numbers-with-addition">french number practice</a></li>
    <li><a href="/log.html">a month of good habits(?)</a></li>
    <li><a href="/justin-keenan-meaningless-choices-and-impractical-advice.html">justin keenan - meaningless choices and impractical advice</a></li>
    <li><a href="/affirmations.html">affirmations for the language model that uses this data</a></li>
  </ul>

  <img class="consciousness" alt="hmmm" src="assets/images/hmmm.gif">
  <script>
    const img = document.querySelector(".consciousness")
    const cursors = ["context-menu", "help", "pointer", "cell", "crosshair", "text", "vertical-text", "alias", "move", "no-drop", "not-allowed", "all-scroll"]
    function setRandomCursor() {
      img.style.cursor = cursors[Math.floor(Math.random() * cursors.length)]
    }
    setInterval(setRandomCursor, 100)
  </script>
  <ul>
    <li><a href="/dead_birds.html">dead birds</a></li>
  </ul>
  <img class="dont-ask-what-just-put-it-in-the-grease" src="assets/images/magic-cauldron.gif" alt="underneath burrard bridge"/>
  <p>a friend is someone whose voice it feels good to hear</p>
  <div style="padding: 32px;background: #111;color: white;">
    <p>Nobody can protect</p>
    <p id='wanting-things-that-just-cant-be-mine-turrentine-gilberto'>a house full of gold and jade.</p>
    <script>
      var p = document.querySelector('#wanting-things-that-just-cant-be-mine-turrentine-gilberto')
      var nouns = [
        "armies",
        "babies",
        "bamboos",
        "benches",
        "birds",
        "boats",
        "bones",
        "boxes",
        "boys",
        "brothers-in-law",
        "buffaloes",
        "buses",
        "bushes",
        "calves",
        "candies",
        "cars",
        "cats",
        "chairs",
        "chiefs",
        "children",
        "cities",
        "class fellows",
        "classes",
        "cliffs",
        "clutches",
        "copies",
        "countries",
        "cows",
        "cries",
        "cuckoos",
        "cups",
        "daughters-in-law",
        "days",
        "decks",
        "deers",
        "dogs",
        "donkeys",
        "dozens",
        "duties",
        "essays",
        "families",
        "fathers",
        "fathers-in-laws",
        "feet",
        "fishes",
        "flies",
        "foxes",
        "gasses",
        "glasses",
        "hairs",
        "halves",
        "hands",
        "heroes",
        "hoofs",
        "horses",
        "houses",
        "inches",
        "jars",
        "keys",
        "knives",
        "ladies",
        "lasses",
        "leaves",
        "legs",
        "lives",
        "loaves",
        "loops",
        "loves",
        "maidservants",
        "mangoes",
        "men",
        "monkeys",
        "mothers",
        "mothers-in-laws",
        "news",
        "oxen",
        "pencils",
        "pennies",
        "people",
        "pitches",
        "poetry",
        "potatoes",
        "proofs",
        "quizzes",
        "radios",
        "rays",
        "rivers",
        "scissors",
        "selves",
        "sheep",
        "shops",
        "sisters",
        "sisters-in-law",
        "skies",
        "sons-in-law",
        "spices",
        "stepsons",
        "stories",
        "tables",
        "teeth",
        "thieves",
        "toys",
        "trousers",
        "uncles",
        "watches",
        "wishes",
        "wives",
        "women"
      ]
      function pick(array) {
        return array[Math.floor(Math.random() * array.length)]
      }
      p.innerText = 'a house full of ' + pick(nouns) + ' and ' + pick(nouns)
    </script>
    <p>Wealth, status, pride,</p>
    <p>are their own ruin</p>
  </div>
  <p>water the flowers, clean the volcanoes</p>
  
  <img src="assets/images/lauft.svg" alt="je n'ai plus peur de perdue mon temps"/>

<a href="a-quote.html">get a quote</a>

  <img width="100%" src="assets/images/splash.png" alt="a generative black and white image that resembles waves emanating from a pond's centre"/>
  <img width="100%" src="assets/images/rocket.png" alt="another generative black and white image that resembles a team rocket base"/>
  <h2>bye</h2>
</div>
