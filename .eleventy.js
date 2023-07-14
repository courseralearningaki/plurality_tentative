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
        // console.log(obj[a].data.language );
        // console.log(obj[a].data.chapterid,obj[a].data.chapterid.chapterid_subid );

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

    // console.log(sorted)
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