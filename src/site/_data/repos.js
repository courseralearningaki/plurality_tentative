const EleventyFetch = require('@11ty/eleventy-fetch');
const {parse} = require("dotenv");

const log_text = `The location of the resource is defined in the md file but was not accessible. The URL is "`
const screen_text =  "Please revisit this page later. The page is currently unavailable but will become available soon."

module.exports = function () {
  return awaitFetch();
}

let awaitFetch = async function() {
  var currentPage = 0;
  var done = false;
  var repoURL = '';
  var result = [];
  console.log(`Fetching GitHub repositories`);
  repoURL = 'https://api.github.com/repos/akinorioyama/plurality_tentative/contents/endorsement';
    console.log(`Fetching ${repoURL}`);

  let persed_json;
  try {
    let returnedContent = await EleventyFetch(repoURL, {
      duration: '1m',
      type: 'text',
      verbose: true
    }).then(
     function(response) {
       console.log(response);
       parsed_json = JSON.parse(response);
       console.log(parsed_json);
       // return parsed_json;
     }
     ).catch(error => {
      console.log(log_text);
      if (fallback_url != null ){
        console.log(log_text_shown_from_fallback)
        return shortcodeFetch(fallback_url,null);
      } else {
        return screen_text;
      }
    });
  } catch (e) {
    console.log(log_text);
  }

  let i = 0;
  let tags_all = [];
  for (let item of parsed_json) {

    let urlContent = await shortFetch(item.download_url).then(
      function(res){
        console.log('res',res)
        parsed_json[i]['md_file'] = res;
        const regex = /---\ntags:\n([\s\S]*?)---/g;
        const regex_tags = /  - (.*?)\n/g;
        const tagList = parsed_json[i]['md_file'].match(RegExp("---\\ntags:\\n(  - .+\\n)+---"),"g");

        if (tagList != null){
            let tags = Array.from(tagList.input.matchAll(regex))[0][1];
            console.log(tags);
            tags_all = [];
            for (let tag_item of Array.from(tags.matchAll(regex_tags))){
              tags_all.push(tag_item[1]);
            }
            parsed_json[i]['tags'] = tags_all;
            parsed_json[i]['md_file'] = parsed_json[i]['md_file'].replace(tagList[0],"");

        } else {
            parsed_json[i]['tags'] = ['none'];
        }
    });
    i++;
  }

  console.log("interim json",parsed_json)

  let arr_htmls = [];
  for (let item of parsed_json ){
    for (let tag of item['tags'] ){
      let item_html = JSON.parse(JSON.stringify(item));
      item_html.tags = tag.toString();
      arr_htmls.push(item_html);
      console.log(item.name, tag);
    }
    if (item['md_file'][0] =="none"){
      arr_htmls.push(item);
    }
  }

  console.log("final json",arr_htmls)
  return arr_htmls;
}
  let shortFetch = async function(url,fallback_url) {
    console.log("shortFetch:", url)
    try {
      let returnedContent = await EleventyFetch(url, {
        duration: '*',
        type: 'text',
        verbose: true
      }).then(
          function (response) {
            return response;
          }
      ).catch(error => {
        console.log(log_text,error,url);
        if (fallback_url != null) {
          console.log(log_text_shown_from_fallback)
          return shortcodeFetch(fallback_url, null);
        } else {
          return screen_text;
        }
      });
      return returnedContent;
    } catch (e) {
      console.log(log_text);
      return screen_text;
    }
  }