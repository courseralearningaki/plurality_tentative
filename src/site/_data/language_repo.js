const EleventyFetch = require('@11ty/eleventy-fetch');
const nodeFetch = require('node-fetch');
const {parse} = require("dotenv");

module.exports = async function () {
  var currentPage = 0;
  var done = false;
  var repoURL = '';
  var result = [];
  const log_text = `The location of the resource is defined in the md file but was not accessible. The URL is "`
  const screen_text =  "Please revisit this page later. The page is currently unavailable but will become available soon."
  console.log(`Fetching GitHub repositories`);
  repoURL = 'https://api.github.com/repos/nishio/plurality-japanese/contents/contents/japanese-auto';
    console.log(`Fetching ${repoURL}`);

  let shortFetch = async  (url,fallback_url) => {
    console.log("shortFetch:", url)
    try {
      let returnedContent = await nodeFetch(url, {
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


  try {
    let returnedContent = await EleventyFetch(repoURL, {
      duration: '1m',
      type: 'text',
      verbose: true
    }).then(
     function(response){
       console.log(response);
       const parsed_json = JSON.parse(response);
       console.log( parsed_json);
       return parsed_json;
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
    return returnedContent;
  } catch (e) {
    console.log(log_text);
    return screen_text;
  }

  return result;
}