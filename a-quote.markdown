---
layout: default
---

<div>
   <script>
    const clippings = fetch("/assets/clippings.json")
      .then(res => res.json())
      .then(clippings => {
        const container = document.querySelector("#who-are-you")
        const clipping = clippings[Math.floor(Math.random() * clippings.length)]
        container.textContent = clipping
      })
  </script>
  <div id="who-are-you"></div>
  <a href="/">back</a>
</div>
