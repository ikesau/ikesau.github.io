---
layout: default
sitemap: false
---

<!-- https://www.youtube.com/results?search_query=hijokoidan+romance -->
<div id="the-gutter" style="margin-top: 32px; font-size: 24px;">you little </div>

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
        "motherfucker",
        "motherfucking",
        "piece of shit",
        "piss",
        "shit",
    ]

    const PLURAL = [
        "motherfuckers",
        "pieces of shit",
        "cunts",
        "dickheads",
        "bitches",
        "weakies",
    ]
    const gutter = document.querySelector("#the-gutter")
    function giveEmHell() {
        return NAUGHTY_NAUGHTY[Math.floor(Math.random() * NAUGHTY_NAUGHTY.length)]
    }
    while (gutter.clientHeight < window.innerHeight - 70) {
        gutter.innerText += ` ${giveEmHell()} `
    }
    gutter.innerText += ` ${PLURAL[Math.floor(Math.random() * PLURAL.length)]}!`

</script>
