---
layout: base
image:
  feature: home-office-595476_1920.jpg
---

<div id="index">
  <h3><a href="{{ site.url}}/posts/">Recent Posts</a></h3>
  {% for post in site.posts limit:5 %} 
  {% capture comments %}
    <span class="comments"><i class="fa fa-fw fa-comments-o"></i><a href="{{ site.url }}{{ post.url }}#disqus_thread"></a></span>
  {% endcapture %}   
  <article>
    {% if post.link %}
      <h2 class="link-post"><a href="{{ site.url }}{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a> <a href="{{ post.link }}" target="_blank" title="{{ post.title }}"><i class="fa fa-link"></i>{{ comments }}</h2>
    {% else %}
      <h2><a href="{{ site.url }}{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a>{{ comments }}</h2>
      <p>{{ post.excerpt | strip_html | truncate: 160 }}</p>
    {% endif %}
  </article>
  {% endfor %}
</div><!-- /#index -->