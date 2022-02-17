const { DateTime } = require("luxon");


module.exports = function(eleventyConfig) {
  eleventyConfig.setTemplateFormats([
    // Templates:
    "html",
    "njk",
    "md",
    // Static Assets:
    "css",
    "jpeg",
    "jpg",
    "png",
    "svg",
    "woff",
    "woff2"
  ]);
  eleventyConfig.addPassthroughCopy("public");

  // change to snippet: false when not updating or testing project
  eleventyConfig.setBrowserSyncConfig({
    snippet: true,
  });

  eleventyConfig.setBrowserSyncConfig({ ghostMode: false });

  let markdownIt = require("markdown-it");
  let markdownItfn = require("markdown-it-footnote");
  let options = {
    html: true
  };
  
  let markdownLib = markdownIt(options).use(markdownItfn);

  markdownLib.renderer.rules.footnote_caption = (tokens, idx) => {
  let n = Number(tokens[idx].meta.id + 1).toString();

  if (tokens[idx].meta.subId > 0) {
    n += ":" + tokens[idx].meta.subId;
  }

  return n;
};

  
  eleventyConfig.setLibrary("md", markdownLib);

  // Filters let you modify the content https://www.11ty.dev/docs/filters/
  eleventyConfig.addFilter("htmlDateString", dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("d LLLL yyyy");
  });

  eleventyConfig.addFilter("myDateString", dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLLL yyyy");
  });

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  
  eleventyConfig.addFilter("excerpt", (post) => {
  const content = post.replace(/(<([^>]+)>)/gi, "");
  return content.substr(0, content.lastIndexOf(" ", 200)) + "...";
});

  eleventyConfig.addCollection("posts", function(collection) {

    const coll = collection
      .getFilteredByTag("post")
      .sort((a, b) => b.data.date - a.data.date);

// From: https://github.com/11ty/eleventy/issues/529#issuecomment-568257426 
    // Adds {{ prevPost.url }} {{ prevPost.data.title }}, etc, to our njks templates
    for (let i = 0; i < coll.length; i++) {
      const prevPost = coll[i - 1];
      const nextPost = coll[i + 1];

      coll[i].data["prevPost"] = prevPost;
      coll[i].data["nextPost"] = nextPost;
    }

    return coll;
  });
  

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "build"
    }
  };
};
