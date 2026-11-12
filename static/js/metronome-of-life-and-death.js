const EARLIEST_YEAR = 1950;
const LATEST_YEAR = 2100;
const SECONDS_PER_YEAR = 365.2425 * 24 * 60 * 60;

const DATA_PATH = "/json/metronome-of-life-and-death";
const AUDIO_PATH = "/audio/metronome-of-life-and-death";

// Lookahead scheduling: a timer wakes every SCHEDULER_TICK_MS and queues every
// beat falling within the next `lookahead` seconds directly onto the
// AudioContext clock. The timer only needs to be roughly on time — the audio
// hardware places each beat exactly — which is what makes this immune to
// setInterval drift.
const SCHEDULER_TICK_MS = 25;
const LOOKAHEAD_ACTIVE = 0.25;
// Background tabs clamp timers to ~1s. A wider lookahead while hidden keeps the
// audio gapless, at the cost of slower response to year changes (which nobody
// is making while the tab is hidden).
const LOOKAHEAD_HIDDEN = 2.0;

const el = {
  start: document.getElementById("start"),
  status: document.getElementById("status"),
  controls: document.getElementById("controls"),
  yearNumber: document.getElementById("year-number"),
  yearSlider: document.getElementById("year-slider"),
  births: document.getElementById("births"),
  deaths: document.getElementById("deaths"),
  birthsTotal: document.getElementById("births-total"),
  birthsRate: document.getElementById("births-rate"),
  deathsTotal: document.getElementById("deaths-total"),
  deathsRate: document.getElementById("deaths-rate"),
  crossover: document.getElementById("crossover"),
  baby: document.getElementById("baby"),
  skull: document.getElementById("skull"),
};

/** year -> { births, deaths } */
let populationByYear = new Map();
/** First year in which deaths exceed births, or null. */
let crossoverYear = null;

let audioCtx = null;
let voices = [];
let birthVoice = null;
let deathVoice = null;
let lookahead = LOOKAHEAD_ACTIVE;

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const nf = new Intl.NumberFormat("en-CA");

/* ------------------------------------------------------------------ */
/* A single rhythmic voice (births or deaths).                         */
/* ------------------------------------------------------------------ */

class Voice {
  constructor(buffer, emojiEl, gain) {
    this.buffer = buffer;
    this.emojiEl = emojiEl;
    this.gain = gain;
    this.period = 1; // seconds between beats
    this.nextBeat = 0; // AudioContext time of the next beat
    this.enabled = false;
  }

  enable() {
    if (this.enabled) return;
    this.enabled = true;
    this.nextBeat = audioCtx.currentTime;
  }

  disable() {
    this.enabled = false;
  }

  /**
   * Change tempo without resetting phase — already-scheduled beats stand, and
   * the new period applies from the next one. This is what keeps scrubbing the
   * year smooth instead of stuttering, and why each voice owns its own period
   * rather than sharing a global restart.
   */
  setPeriod(seconds) {
    this.period = seconds;
  }

  scheduleBeat(time) {
    const source = audioCtx.createBufferSource();
    source.buffer = this.buffer;
    source.connect(this.gain);
    source.start(time);

    if (prefersReducedMotion) return;

    // Fire the visual at the same moment the sample hits. setTimeout is
    // imprecise, but a few ms of visual jitter is imperceptible; the audio is
    // what has to be exact.
    const delayMs = Math.max(0, (time - audioCtx.currentTime) * 1000);
    window.setTimeout(() => {
      this.emojiEl.animate([{ opacity: 1 }, { opacity: 0 }], {
        // Cap the fade so slow tempos don't leave the emoji lit forever.
        duration: Math.min(this.period * 1000 * 0.9, 400),
        easing: "ease-out",
      });
    }, delayMs);
  }
}

function schedulerTick() {
  const now = audioCtx.currentTime;
  for (const voice of voices) {
    if (!voice.enabled) continue;
    // If the tab was throttled we may be far behind; snap to now rather than
    // dumping every missed beat into the queue at once.
    if (voice.nextBeat < now) voice.nextBeat = now;
    while (voice.nextBeat < now + lookahead) {
      voice.scheduleBeat(voice.nextBeat);
      voice.nextBeat += voice.period;
    }
  }
}

document.addEventListener("visibilitychange", () => {
  lookahead = document.hidden ? LOOKAHEAD_HIDDEN : LOOKAHEAD_ACTIVE;
});

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  return response.json();
}

async function loadData() {
  const [births, deaths] = await Promise.all([
    fetchJson(`${DATA_PATH}/births.json`),
    fetchJson(`${DATA_PATH}/deaths.json`),
  ]);

  const map = new Map();
  for (const row of births) map.set(row.year, { births: row.births });
  for (const row of deaths) {
    const entry = map.get(row.year);
    if (entry) entry.deaths = row.deaths;
  }
  // Drop any year missing either series so lookups are always complete.
  for (const [year, entry] of map) {
    if (typeof entry.deaths !== "number") map.delete(year);
  }
  populationByYear = map;

  crossoverYear = null;
  for (let year = EARLIEST_YEAR; year <= LATEST_YEAR; year++) {
    const entry = map.get(year);
    if (entry && entry.deaths > entry.births) {
      crossoverYear = year;
      break;
    }
  }
}

async function loadSample(name) {
  const response = await fetch(`${AUDIO_PATH}/${name}`);
  if (!response.ok) throw new Error(`${name}: ${response.status}`);
  return audioCtx.decodeAudioData(await response.arrayBuffer());
}

/* ------------------------------------------------------------------ */
/* Year handling                                                       */
/* ------------------------------------------------------------------ */

/** Clamp to the data range, rejecting partial input like "19" or "". */
function normalizeYear(raw) {
  const year = parseInt(raw, 10);
  if (Number.isNaN(year)) return null;
  if (year < EARLIEST_YEAR || year > LATEST_YEAR) return null;
  return populationByYear.has(year) ? year : null;
}

function updateCrossoverNote(year, entry) {
  if (crossoverYear === null) {
    el.crossover.textContent = "";
    return;
  }
  const ratio = entry.births / entry.deaths;
  if (year < crossoverYear) {
    const yearsAway = crossoverYear - year;
    el.crossover.classList.remove("past");
    el.crossover.textContent =
      `${ratio.toFixed(2)} births for every death. ` +
      `${yearsAway} year${yearsAway === 1 ? "" : "s"} until the pulses cross in ${crossoverYear}.`;
  } else {
    el.crossover.classList.add("past");
    el.crossover.textContent =
      `${ratio.toFixed(2)} births for every death. ` +
      `Since ${crossoverYear}, deaths outnumber births.`;
  }
}

function applyYear(year) {
  const entry = populationByYear.get(year);
  if (!entry) return;

  const birthsPerSecond = entry.births / SECONDS_PER_YEAR;
  const deathsPerSecond = entry.deaths / SECONDS_PER_YEAR;

  birthVoice.setPeriod(1 / birthsPerSecond);
  deathVoice.setPeriod(1 / deathsPerSecond);

  el.birthsTotal.textContent = nf.format(entry.births);
  el.birthsRate.textContent = birthsPerSecond.toFixed(2);
  el.deathsTotal.textContent = nf.format(entry.deaths);
  el.deathsRate.textContent = deathsPerSecond.toFixed(2);

  updateCrossoverNote(year, entry);
}

/** Keep the slider and number field in sync from a single entry point. */
function setYear(year, { syncNumber = true, syncSlider = true } = {}) {
  if (syncNumber) el.yearNumber.value = String(year);
  if (syncSlider) el.yearSlider.value = String(year);
  applyYear(year);
}

/* ------------------------------------------------------------------ */
/* Wiring                                                              */
/* ------------------------------------------------------------------ */

function syncVoiceEnabled() {
  if (el.births.checked) birthVoice.enable();
  else birthVoice.disable();

  if (el.deaths.checked) deathVoice.enable();
  else deathVoice.disable();
}

async function start() {
  el.start.disabled = true;
  el.status.textContent = "Loading audio…";

  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // Must happen inside the click handler's task to satisfy autoplay policy —
    // an AudioContext created outside a gesture starts suspended.
    await audioCtx.resume();

    const [birthBuffer, deathBuffer] = await Promise.all([
      loadSample("birth.mp3"),
      loadSample("death.mp3"),
    ]);

    const gain = audioCtx.createGain();
    gain.gain.value = 0.1;
    gain.connect(audioCtx.destination);

    birthVoice = new Voice(birthBuffer, el.baby, gain);
    deathVoice = new Voice(deathBuffer, el.skull, gain);
    voices = [birthVoice, deathVoice];

    const startYear = Math.min(
      Math.max(new Date().getFullYear(), EARLIEST_YEAR),
      LATEST_YEAR
    );
    setYear(startYear);
    syncVoiceEnabled();

    window.setInterval(schedulerTick, SCHEDULER_TICK_MS);

    el.start.hidden = true;
    el.status.textContent = "";
    el.controls.hidden = false;
  } catch (error) {
    el.status.classList.add("error");
    el.status.textContent = `Could not start audio: ${error.message}`;
    el.start.disabled = false;
    el.start.textContent = "Retry";
  }
}

el.start.addEventListener("click", start);

// Reject partial/out-of-range input instead of indexing past the data, which is
// what made typing a year throw.
el.yearNumber.addEventListener("input", function () {
  const year = normalizeYear(this.value);
  if (year === null) return;
  setYear(year, { syncNumber: false });
});

// On blur, snap a rejected value back to something valid so the field can't be
// left showing a year the audio isn't playing.
el.yearNumber.addEventListener("blur", function () {
  if (normalizeYear(this.value) === null) {
    this.value = el.yearSlider.value;
  }
});

el.yearSlider.addEventListener("input", function () {
  const year = normalizeYear(this.value);
  if (year === null) return;
  setYear(year, { syncSlider: false });
});

// Toggling one voice must not restart the other — each voice keeps its own
// phase, so the untouched pulse never stutters.
el.births.addEventListener("change", syncVoiceEnabled);
el.deaths.addEventListener("change", syncVoiceEnabled);

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */

loadData()
  .then(() => {
    el.start.disabled = false;
    el.start.textContent = "Begin";
    el.status.textContent = "Audio starts on click, as browsers require.";
  })
  .catch((error) => {
    el.status.classList.add("error");
    el.status.textContent = `Could not load data: ${error.message}`;
    el.start.textContent = "Unavailable";
  });
