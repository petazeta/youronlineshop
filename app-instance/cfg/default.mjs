export default {
  // masterPassword: false, // not implemented
  autoLogin: false,
  // serverPath: "server", // for logs
  // basePath: "./", // For folders: shared, client, catalog-images, layouts, site
  sitePath: "./site/main",
  // siteImagesPath: "./site/main/images",
  layoutsPath: "./layouts",
  catalogImagesPath: "./catalog-images/main",
  reportsFilePath: "./logs/logs.txt",
  clientPath: "./client", // server, shared and client should be in the same dir
  sharedPath: "./shared", // server, shared and client should be in the same dir
  requestMaxSize: 1e6,
  reportsFileMaxSize: 50000, // Characteres or bytes
  defaultThemeId: "root", // Select the theme
  defaultSubThemeId: null, // Select the sub-theme
  defaultStyleId: "main", // Select the style
  // catalogImagesSmallFolderName: "small",
  // catalogImagesBigFolderName: "big",
  // cssImagesUrlPath: "css-images",
  timeZone: 'Europe/Madrid',
  cache: 'mongodb', // => mem, redis, mongodb, none.
}