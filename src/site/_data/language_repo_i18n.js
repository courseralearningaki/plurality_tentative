const EleventyFetch = require('@11ty/eleventy-fetch');
const nodeFetch = require('node-fetch');
const {parse} = require("dotenv");
const fs = require("fs");

  const log_text = `The location of the resource is defined in the md file but was not accessible. The URL is "`
  const screen_text =  "Please revisit this page later. The page is currently unavailable but will become available soon."

function readJSON() {
  const input = fs.readFileSync("./src/site/_data/language_config.json");
  const parsed_json = JSON.parse(input);
  return parsed_json;
}


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

module.exports = async function () {

  let language_json = readJSON();
  let language_list = [];
  try {

    let j = 0;
    var item;
    var parse_json;
    for (let item2 of language_json) {
      console.log(item2.id);
      console.log(item2.name);
      console.log(item2.repo);
      console.log(item2.part_id_text);
      try {
        let returnedContent = await EleventyFetch(item2.repo, {
          duration: '1m',
          type: 'text',
          verbose: true
        }).then(
            function (response) {
              console.log(response);
              const parsed_json = JSON.parse(response);
              console.log("item");
              let i = 0;
              for (let item of parsed_json) {
                console.log(item.name);
                parsed_json[i]['id_of_part'] = item.name.match(RegExp("\\b0*(\\d+)-0*(\\d+)", "g"));
                if (parsed_json[i]['id_of_part'] === null) {
                  parsed_json[i]['id_of_part'] = item.name.match(RegExp("\\b0*(\\d+)-0*(\\d+)|\\b0*(\\d+)", "g"))
                  if (parsed_json[i]['id_of_part'] === null) {
                    parsed_json[i]['id_of_part'] = item.name.replace(RegExp("(.+?)\\.md$"), "$1").replaceAll("-", " ").replaceAll(" ", "");
                    parsed_json[i]['name_of_part'] = parsed_json[i]['id_of_part'];
                  }
                  parsed_json[i]['name_of_part'] = item.name.replace(RegExp("\\b0*\\d+-(.+?)\\.md$"), "$1").replaceAll("-", " ")
                } else {
                  parsed_json[i]['name_of_part'] = item.name.replace(RegExp("\\b0*\\d+-0*\\d+-(.+?)\\.md$"), "$1").replaceAll("-", " ");
                }
                console.log(parsed_json[i]['id_of_part'], parsed_json[i]['name_of_part']);
                i++;
              }
              console.log("return parsed_json;");
              language_json[j].urls = parsed_json;
              let part_heading_pushed = [];
              let pushing_line;
              for (let each_url of parsed_json){
                pushing_line = JSON.parse(JSON.stringify(language_json[j]));
                pushing_line.urls = each_url;
                pushing_line.upperpart_id = ""
                pushing_line.upperpart_text = ""
                if (( part_heading_pushed.indexOf(pushing_line.urls.id_of_part[0][0]) ) == -1) {
                  // first heading
                  pushing_line.upperpart_id = "."
                  pushing_line.upperpart_text = pushing_line.urls.id_of_part[0][0];
                  for ( let each_id of pushing_line.part_id_text){
                    if (pushing_line.urls.id_of_part[0][0] == each_id.id) {
                      if ((part_heading_pushed.indexOf(each_id.id)) == -1) {
                        pushing_line.upperpart_id = each_id.id
                        pushing_line.upperpart_text = each_id.part
                        part_heading_pushed.push(each_id.id)
                      }
                    }
                  }
                  if (pushing_line.upperpart_id == "."){
                    part_heading_pushed.push(pushing_line.urls.id_of_part[0][0])
                  }
                }
                language_list.push(pushing_line)
              }

              j++;
            }
        ).catch(error => {
          console.log(log_text);
          return screen_text;
        });
        // return returnedContent;
      } catch (e) {
        console.log(log_text);
        return screen_text;
      }
    }

  } catch (e) {
    console.log(log_text);
    return screen_text;
  }
  console.log("language_json",language_json);
  console.log("language_list",language_list)
  return language_list;
}