---
bodyClass: "valentine"
title: History of Love
permalink: /love/
image:
---

<audio src="/assets/music/dreamer.mp3" autoplay loop></audio>

With love about us!

{% for image in site.data.gallery.valentine %}
  <figure class="small">
    <a href="{{ site.url }}/images/gallery/valentine/{{ image.file }}"><i class="fa fa-heart"></i><img src="{{ site.url }}/images/gallery/valentine/small/{{ image.file }}"></a>
		<figcaption>{{ image.caption }}</figcaption>
  </figure>
{% endfor %}
