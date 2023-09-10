const pluginTOC = require('eleventy-plugin-toc')
const htmlmin = require("html-minifier");
const EleventyFetch = require('@11ty/eleventy-fetch');
const moment = require("moment/moment");

module.exports = function(eleventyConfig) {
  eleventyConfig.setLibrary(
    'md',
    markdownIt = require('markdown-it')({
      html: true
    }).use(require('markdown-it-anchor'))
      .use(require('markdown-it-footnote'))
    );
  eleventyConfig.addPlugin(pluginTOC, {
    tags: ['h1', 'h2', 'h3'],
    ul: true,
    wrapper: 'div'
  });

  eleventyConfig.addAsyncShortcode('readdynamiccode',  async (url) => {
      console.log(Date.now());
      try {
          let returnedContent = EleventyFetch(url, {
              duration: '1m',
              type: 'text',
              verbose: true
          }).then(
               function(response){
                return response;
            }
              ).catch(error => {
                  console.log(`The location of the resource is defined in the md file but was not accessible. The URL is "${url}"`);
                  return "Please visit this page again later. The page is currently unavailable but the work for this page is under work in process and will become available in due time.";
      });
          return returnedContent;
      } catch (e) {
          console.log(`The location of the resource is defined in the md file but was not accessible. The URL is "${url}"`);
          return "Please visit this page again later. The page is currently unavailable but the work for this page is under work in process and will become available in due time.";
      }
  });

  eleventyConfig.addAsyncShortcode('update_ts', async (url) => {

      console.log(Date.now());

        const path = require("path");
        const fs = require("fs");
        const moment = require("moment");
        const filesDirectory = "./src" //path.join(process.cwd());
        const file_dir = `${filesDirectory}/site/_update_interval`;
        const updateFile = (filename) => {
            console.log(`looking up folder - ${file_dir}`);
            if (fs.existsSync(file_dir)!=true) {
                console.log(`create folder - ${file_dir}`);
                try {
                    fs.mkdirSync(file_dir,{recursive:true});
                    console.log(`folder (${file_dir})  created`)
                } catch (err) {
                    console.log(err.name + ':' +err.message)
                    console.log(`creation of folder (${file_dir}) failed`)
                }
            }

            const fullName = `${file_dir}/${filename}`;
            const content = `${moment().format("YYYYMMDD hh:mm:ss")}`;
            try {
                fs.writeFileSync(fullName, content, "utf8" );
                console.log(`file (${fullName}) created `);
                return content;
            } catch (err) {
                console.log(`file (${fullName}) not created with error ${err.message}`);
                return "Error: " + err.message;
            }
        };


        updateFile('ts');
  });



  eleventyConfig.addTransform("any", function(content, outputPath) {
    if( outputPath.endsWith(".html") ) {
      let minified = content;
      minified = _replaceContentTokens( outputPath, minified);
      return minified;
    }
  });

  // eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
  //   if( outputPath.endsWith(".html") ) {
  //     let minified = htmlmin.minify(content, {
  //       useShortDoctype: true,
  //       removeComments: true,
  //       collapseWhitespace: true
  //     });
  //     return minified;
  //   }
  // });

  eleventyConfig.addFilter("sortDataByLanguageIso", (obj) => {
    const sorted = [];
    Object.keys(obj)
      .sort((a, b) => {
        if (('language' in obj[a].data && 'language' in obj[b].data) !== true){
          return -1;
        } else {
          return obj[a].data.language.iso6392B > obj[b].data.language.iso6392B ? 1 : -1;
        }
      })
      .forEach((name, index) => {
        sorted[index] = obj[name]
      });
    return sorted;
  });

  eleventyConfig.addFilter("sortDataByChapteridSubidLanguageIso", (obj) => {

    const sorted = [];
    console.log(Object.keys(obj));
    Object.keys(obj)
      .sort((a, b) => {

        if (('language' in obj[a].data && 'language' in obj[b].data) !== true) {
          return 0;
        }
        if (('chapterid' in obj[a].data && 'chapterid' in obj[b].data) !== true) {
          return 0;
        }
        if (('chapterid_subid' in obj[a].data.chapterid && 'chapterid_subid' in obj[b].data.chapterid) !== true) {
          return 0;
        }

        if (obj[a].data.chapterid.chapterid_subid > obj[b].data.chapterid.chapterid_subid ) {
          return 1;
        } else if (obj[a].data.chapterid.chapterid_subid < obj[b].data.chapterid.chapterid_subid ){
          return -1;
        }

        if (obj[a].data.language.iso6392B > obj[b].data.language.iso6392B ) {
          return 1;
        } else if (obj[a].data.language.iso6392B < obj[b].data.language.iso6392B ) {
          return -1;
        }
        return 0;
      })
      .forEach((name, index) => {
        sorted[index] = obj[name]
      });
      console.log("start list")
      sorted.forEach((name, index) => {
        console.log(name.data.language.en,name.data.language.iso6392B);
        console.log(name.data.chapterid.chapterid_subid);
        console.log(name.data.url);
      });

    return sorted;


  });



  eleventyConfig.addPassthroughCopy({
    "src/site/_includes/css/*.css" : "assets/css",
    "src/site/_includes/js/*.js" : "assets/js",
    "src/site/_includes/favicons/*.png" : "assets/favicons",
    "src/site/_data/fonts/authentic-sans/*" : "assets/fonts/authentic-sans",
    "src/site/_data/fonts/lanapixel/*" : "assets/fonts/lanapixel",
  });

  eleventyConfig.addWatchTarget("_update_interval");

  return {
    dir: {
      input: "src/site",
      output: "dist",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data"
    }
  }
}

function _replaceContentTokens(outputPath, content) {

    if (outputPath == "dist/v/eng/index.html"){
        let copy_of_content = content;
        const regex = /<!--\s*tooltip\s+{([^{}]*)}+{([^{}]*)}\s*-->/g;
        const newText = copy_of_content.replace(regex, (match, base_text,tooltip_text) => {
            const return_text = `<u><span class="tooltip" data-tooltip="(tooltip)${tooltip_text}">` +
                `${base_text}</span></u>`
            console.log(`Replaced "${base_text}" with "${tooltip_text}"`)
            return return_text;
        });
        content = newText;
    }
  return content;
}
  // content = content.replaceAll('Plurality','<!-- tooltip {Plurality Base}{Plurality Tooltip} -->');
  //         content = content.replaceAll('Plurality',
  //             '<span class="tooltip" id="plurality-label" data-tooltip="tooltip text.\n' +
  //             'Plurality is technology that recognized, honors, and empower the collaboration." >Plurality (tooltip)</span>'
  //         );
  // content = content.replace('<div id="version-md">',
  //     '<span aria-describedby="plurality-label" style="display:inline-block;">Plurality(tooltip)</span>' +
  //     '<div id="version-md">' +
  //     '<div role="tooltip" id="plurality-label">Plurality text long, long,long, long,long, long,long, long</div>'
  //     );
  //     '<details style="list-style:none;display:inline-block"><summary style="list-style:none;display:list-item">Plurality</summary>summary</details>' +
  //     '<div style="display:inline-block" title="Plurality text long, long,long, long,long, long,long, long,">Plurality(div)</div>' +
  //       `<script>document.write("P-l-u-r-ality");
  //        </script>`
  // content += '<div role="tooltip" id="plurality-label">Plurality text long, long,long, long,long, long,long, long</div>'
