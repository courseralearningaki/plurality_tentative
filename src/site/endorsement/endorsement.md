---
title: 'Endorsement test'
githubLink:
dateStartedString: { day: '10', month: '01', year: '2024' }
language: { en: 'english', iso6392B: 'eng', locale: 'english' }
chapterid: { chapterid: endorsement, chapterid_subid: 'endorsement'}
translators: []
layout: endorsement
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
{% if repos.length > 0 %}
  <p>Number of Repositories: {{ repos.length }}</p>
  <table>
    {% tablerow repo in repos cols:2 %}
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