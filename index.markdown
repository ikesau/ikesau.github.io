---
layout: default
---

<div>
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
  <ul>
    <li><a href="/eyes.html">eyes</a></li>
    <li><a href="/life.html">life </a></li>
    <li><a href="/n-body.html">n-body </a></li>
  </ul>
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
  <p>water the flowers - clean the volcanoes</p>

  <h2>bye</h2>
</div>
