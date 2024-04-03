const EleventyFetch = require('@11ty/eleventy-fetch');
const {parse} = require("csv-parse/sync");

module.exports = async function () {
  var repoURL = '';
  const log_text = `The location of the resource is defined in the md file but was not accessible. The URL is "`
  const screen_text =  "Please revisit this page later. The page is currently unavailable but will become available soon."
  console.log(`Fetching GitHub repositories`);
  repoURL = 'https://raw.githubusercontent.com/pluralitybook/plurality/main/scripts/index/contributors.tsv';

  console.log(`Fetching ${repoURL}`);

  try {
    let returnedContent = await EleventyFetch(repoURL, {
      duration: '1m',
      type: 'text',
      verbose: true
    }).then(
     function(response){
       console.log(response);
       const records = parse(response, {
         columns: false,
         delimiter: '\t',
         skip_empty_lines: true,
         });
       console.log(`${records.length} records found.`);
       return records;
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