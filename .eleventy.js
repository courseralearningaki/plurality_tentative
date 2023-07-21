const pluginTOC = require('eleventy-plugin-toc')
const htmlmin = require("html-minifier");
const EleventyFetch = require('@11ty/eleventy-fetch');

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

  eleventyConfig.addAsyncShortcode('readdynamiccode', async (url) => {
      console.log(Date.now());
      return EleventyFetch(url, {
          duration: '1m',
          type: 'text',
          verbose: true
      });
  });

  eleventyConfig.addAsyncShortcode('update_ts', async (url) => {

      console.log(Date.now());
        const path = require("path");
        const moment = require("moment");
        const fs = require("fs");
        const filesDirectory = path.join(process.cwd());
        const file_dir = `${filesDirectory}/_update_interval`;
        const updateFile = (filename) => {

            if (fs.existsSync(file_dir)!=true) {
                console.log('create folder');
                try {
                    fs.mkdirSync(dir=file_dir,{recursive:true});
                } catch {
                    console.log(`${file_dir} already exists`)
                }
            }

            const fullName = `${file_dir}/${filename}`;
            const content = `${moment().format("YYYYMMDD hh:mm:ss")}`;
            try {
                fs.writeFileSync(fullName, content, { encoding: "utf8" });
                return content;
            } catch (err) {
                return "Error: " + err.message;
            }
        };
        updateFile('ts');
  });





  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if( outputPath.endsWith(".html") ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
  });

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