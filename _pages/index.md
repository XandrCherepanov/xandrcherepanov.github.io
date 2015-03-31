---
layout: base
permalink: /
---

<div id="index">
  <h3><a href="{{ site.url}}/posts/">Recent Posts</a></h3>
  {% for post in site.posts limit:5 %} 
  {% capture comments %}
    <span class="comments"><i class="fa fa-fw fa-comments-o"></i> <a href="{{ site.url }}{{ post.url }}#disqus_thread"></a></span>
  {% endcapture %}   
  <article>
    {% if post.link %}
      <h2 class="link-post"><a href="{{ site.url }}{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a> <a href="{{ post.link }}" target="_blank" title="{{ post.title }}"><i class="fa fa-link"></i></h2>
    {% else %}
      <h2><a href="{{ site.url }}{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a></h2>
    {% endif %}
    <p class="byline">{{ comments }}{% if post.modified %}<time datetime="{{ post.modified | date: "%Y-%m-%d" }}">{% include _date.html date=post.modified %}</time>{% else %}<time datetime="{{ post.date | date_to_xmlschema }}">{% include _date.html date=post.date %}</time>{% endif %}</p>
    <p>{{ post.excerpt | strip_html }}</p>
  </article>
  {% endfor %}
</div><!-- /#index -->