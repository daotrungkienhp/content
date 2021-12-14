const { computeCollectionLoader } = require("@slybridges/kiss")

/****************************************************************************/
/* kiss config: see below for most used config attributes.                  */
/* All options commented out are optional.                                  */
/* To see all available options, refer to:                                  */
/* https://github.com/slybridges/kiss/blob/main/src/config/defaultConfig.js */
/****************************************************************************/

module.exports = (config) => {
  /** initial context **/

  // context is where kiss will store the full state of the website before writing it
  // use context.site to store global values that need to be accessible in every page
  // each value will be accessible in your template under the {{site}} object
  // For example: {{site.title}}
  config.context.site = {
    // setting a URL is mandatory for your site to look good when shared
    // and for generating the RSS feed
    url: "https://example.com",

    // Setting a title for your website is highly recommended
    title: "My Static Site",

    // Enter a description for your website to be used by default
    description: "A static site about creating static sites, made by cats.",

    // kiss will automatically pick the first image it finds in the page content
    // But setting a default image to use for pages that don't have any
    // is highly recommended to look nice when shared on the internet.
    // ⚠️ the path should be relative to your content folder
    image: "/deux_and_archy.jpg",

    // locale is used to help search engines and RSS feeds
    // locale: needs to be an array because some expect en-US while others en_US (looking at you, OpenGraph)
    // Use {{ site.locale|join('-') }} to generate the appropriate locate in templates
    // Use the getLocale() helper to generate the locale string in the code
    locale: ["en", "US"],

    // add you own global values here
    // my_key: "my_value",
  }

  /** loaders **/

  // Let's compute tag pages.
  // Pages will be accessible via the /tags/{{tagname}} url
  config.loaders.push({
    source: "computed",
    handler: computeCollectionLoader,
    groupBy: "tags",
    groupByType: "array",
  })

  /** build defaults **/

  // sortCollectionBy: the page attribute on which to sort collections by
  // use "-" to reverse order
  // config.defaults.sortCollectionBy = "-created"

  // dateFormat: default format used with dateFormat nunjucks filter
  // see https://date-fns.org/v2.19.0/docs/format for the list of available options
  // config.defaults.dateFormat =  "MMMM do, yyyy 'at' hh:mm aaa"

  // pagePublishedAttribute and pageUpdatedAttribute:
  // used by default for meta tags, Sitemap and RSS feeds
  // config.defaults.pagePublishedAttribute = "created"
  // config.defaults.pageUpdatedAttribute = "modified"

  /** image optimizations **/

  // image optimizations create responsive images at different resolutions
  // and add an srcset attribute for faster loading times.
  // See the following article to learn more about working with responsive images:
  // https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images

  // turn active to false to skip image optimizations (active by default)
  // config.image.active = true

  // overwrite: when false, overwrite will not recompute images when file already exists
  // recommended to set overwrite to false in dev for improve performances
  // config.image.overwrite = config.env === "production"

  // formats: image format outputs. Supported are: jpeg, webp and avif.
  // If more than one format is included, kiss will generate images for each of them
  // and embed them in a <picture> element
  config.image.formats = ["jpeg", "webp"] // default is ["jpeg"]

  // widths: set of widths in pixel in which to resize the images.
  // Will be used to generate the srcset in <img> or <picture> elements
  // use "original" to keep the original resolution as part of the widths
  // config.image.widths = [320, 640, 1024, 1366, "original"]

  // defaultWidth: width to use for elements that don't support srcset
  // for example for the <meta property="og:image"> attribute
  // config.image.defaultWidth = 1024

  // sizes: <img> and <source> sizes attribute
  // media queries to guide the browser in choosing the right picture from srcset
  // config.image.sizes = ["(min-width: 1024px) 1024px", "100vw"]

  // blur: when true, kiss will replace all images with a lowRes burred version
  // and load the actual image lazily
  // ⚠️ you will need vanilla-lazyload loaded in your pages for this to work:
  // https://github.com/verlok/vanilla-lazyload
  config.image.blur = true // default is false

  /** hooks **/
  // use hooks to add custom behaviour at some points during the build.
  // There are 4 events you can hook into:
  // - loadLibs: run after config is loaded to add specific libraries to config.
  // - preLoad: run before loaders are called and return updated context
  // - postLoad: run after all loaders have completed and return updated context
  // - postWrite: run after all writers have completed
  // Each hook is an object with an "action" key. Action can either be:
  // - run: run the function in the "handler" key and copy the result as a new context or config
  // - copy: copy a file from the "from" key to the "to" key
  // - exec: exec the shell command from the "command" key

  // Hook example 1: copy your stylesheet to the public folder
  config.hooks.postWrite.push({
    action: "copy",
    description: "Copying CSS Stylesheet",
    from: "./theme/css/styles.css",
    to: "./css/styles.css",
  })

  config.hooks.postWrite.push({
    action: "copy",
    description: "Copying CSS Stylesheet",
    from: "./static/",
    to: "./",
  })

  // Hook example 2: copy vanilla-lazyload (required if you want to use image blurs)
  // Assumes that you have installed it with npm i --save vanilla-lazyload
  config.hooks.postWrite.push({
    action: "copy",
    description: "Copying lazyload.min.js",
    from: "./node_modules/vanilla-lazyload/dist/lazyload.min.js",
    to: "./js/lazyload.min.js",
  })

  // Hook example 3: add custom nunjucks filter
  // const loadMyCustomFilter = (context, config) => {
  //   config.libs.nunjucks.addFilter("myCustomFilter", (str) => "custom" + str)
  //   return config
  // }
  // config.hooks.loadLibs.push({
  //   action: "run",
  //   description: "Add myCustomFilter nunjucks filter",
  //   handler: loadMyCustomFilter,
  // })

  // Hook example 4: run tailwind css compile
  // Assumes that you have installed it with npm i --save tailwindcss tailwindcss-cli
  // and have a valid tailwind.config.js at the root
  // config.hooks.postWrite.push({
  //   action: "exec",
  //   description: "Building tailwind CSS",
  //   command:
  //     "npx tailwindcss-cli build -i ./theme/css/tailwind.css -o ./public/css/styles.css",
  // })

  /** There is more: see defaultConfig for all options **/
  // dirs: configure the source, public and theme directory paths
  // loaders: used to load data into context
  // dataViews: used to compute data derived from context
  // transforms: used to transform and enrich data loaded context
  // writers: used to write context data to file
  // rss: used to generate a feed.xml file for search engines (active by default)
  // sitedata: used to generate a JSON dump of context to file (active in dev by default)
  // sitemap: used to generate a sitemap.xml file for search engines (active by default)

  return config
}
