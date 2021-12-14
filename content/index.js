// Values here enrich or overwrite default page attributes defined in
// https://github.com/slybridges/kiss/blob/main/src/data/initialPageData.js
// those values can either be static or dynamic (functions)

module.exports = {
  // All sub-folders and posts will inherit from values defined here
  // Set a default author at the top level. You can then override it
  // with another author at an individual post level or folder level
  author: {
    name: "Deux Whitecat",
    email: "deux@example.com",
    //uri: "https://example.com/iamdeux",
  },
  // if you don't want data to cascade down, add "_no_cascade" after an attribute
  // for example, here we want the home page (top level page) to use a specific layout
  // but we want all other pages to use the default computeLayout function
  // from initialPageData to determine the layout
  layout_no_cascade: "home.njk",
}
