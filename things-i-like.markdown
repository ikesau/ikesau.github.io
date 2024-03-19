---
layout: thing-i-like
---

<details id="what-is-this">
<summary id="i-like-it-when-you-click-me">
?
</summary>
<p>
this is a list of things i encounter that i like that <a href="/cool_websites.html">aren't websites</a> and want to either share and/or say something about and/or find again later
</p>
<p>
because it's more fun to create an aesthetic object out of this urge than it is to post youtube links into the void on social media

<p><a href="{{'feed.xml' | absolute_url}}">atom feed</a></p>

</p>

</details>

<div>
{% for post in site.categories.thing-i-like %}
{{post.content}}
{% endfor %}
</div>
