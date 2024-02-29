---
title: 'Language test'
githubLink:
dateStartedString: { day: '10', month: '01', year: '2024' }
language: { en: 'english', iso6392B: 'eng', locale: 'english' }
chapterid: { chapterid: languages, chapterid_subid: 'language'}
translators: []
layout: home
pageOrder: 1
---
<br>
<br>
<br>
<br>
<br>

<h1>
This is a test page for pulling data from external folder.
</h1>
<br>
<br>
{% if language_repo.length > 0 %}
  <p>Number of Repositories: {{ language_repo.length }}</p>
  <table>
    {% tablerow repo in language_repo cols:2 %}
      <a href="{{ repo.download_url }}" target="_blank">{{ repo.name }}</a>
      {% if repo.description.length > 0 %}
        {{ repo.description }}
      {% endif %}    
    {% endtablerow %}
  </table>  
  <table>
    {% tablerow repo in language_repo cols:2 %}
      <a href="{{ repo.download_url }}" target="_blank">{{ repo.name }}</a>
      {% if repo.description.length > 0 %}
        {{ repo.description }}
      {% endif %}    
        {% readdynamiccode repo.download_url %}
    {% endtablerow %}
  </table>  

{% else %}
    <p>No repository data to display</p>
{% endif %}