---
layout: thing-i-like
category: thing-i-like
title: Clinton Jones's 3D render competitions
---

<style>
#basically-what-im-saying-is-we-about-to-slide {
  position: relative;
  overflow: hidden;
}

#basically-what-im-saying-is-we-about-to-slide::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 30px;
  background: var(--line-color, red);
  z-index: -1;
  transform: rotate(40deg) scale(2);
  animation: slideRight 5s infinite;
}

@keyframes slideRight {
  from {
    left: -30%;
  }
  to {
    left: 130%;
  }
}
</style>
<section id="basically-what-im-saying-is-we-about-to-slide">
<a href="https://www.youtube.com/playlist?list=PLFB0oFTSWSYb1mpL9YCFAT1YmSl3G--Ew"><h2>{{page.title}}</h2></a>
<p>
these things rule. the variety and quality of people's submissions is incredibly inspiring. some participants detail their <a href="https://www.youtube.com/watch?v=tCTkkHGRpNk">workflows</a> which makes me think:
<ol>
<li>It is amazing how much skill this takes</li>
<li title="20 years ago it took millions of dollars and a whole company of people to make Antz">It is amazing how one person can do all of this</li>
</ol>
</p>
<section>
<script>
const imSoSleepy = document.getElementById("basically-what-im-saying-is-we-about-to-slide");

function getRandomColor() {
const letters = '0123456789ABCDEF';
let color = '#';
for (let i = 0; i < 6; i++) {
color += letters[Math.floor(Math.random() * 16)];
}
return color;
}
imSoSleepy.addEventListener('animationiteration', () => {
const newColor = getRandomColor();
imSoSleepy.style.setProperty('--line-color', newColor);
});
</script>
