---
layout: default
---
<!-- https://www.youtube.com/results?search_query=hijokoidan+romance -->
<div id="the-gutter" style="margin-top: 32px;">you little </div>

<script>
    const NAUGHTY_NAUGHTY = [
        "ass",
        "asshole",
        "big",
        "bitch",
        "bloody",
        "cock",
        "cunt",
        "dickhead",
        "dumbass",
        "fuck",
        "fuckass",
        "fucking",
        "god damn",
        "little",
        "motherfucking",
        "piece of shit",
        "piss",
        "shit",
    ]
    const gutter = document.querySelector("#the-gutter")
    function giveEmHell() {
        return NAUGHTY_NAUGHTY[Math.floor(Math.random() * NAUGHTY_NAUGHTY.length)]
    }
    while (gutter.clientHeight < window.innerHeight - 60) {
        gutter.innerText += ` ${giveEmHell()} `
    }
    gutter.innerText += ` piece of shit!`

</script>