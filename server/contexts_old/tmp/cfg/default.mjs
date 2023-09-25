export default {
  autoLogin: false,
  sitePath: "./loader/main",
  layoutsPath: "./layouts",
  catalogImagesPath: "./catalog-images/main",
  reportsFilePath: "./logs/logs.txt",
  clientPath: "./client", // server, shared and client should be in the same dir
  sharedPath: "./shared", // server, shared and client should be in the same dir
  requestMaxSize: 1e6,
  reportsFileMaxSize: 50000, // Characteres or bytes
  timeZone: 'Europe/Madrid',
  cache: 'mem', // => mem, redis, mongodb, none.
  requestUrlPath: "request.cmd",
  layoutsUrlPath: "layouts.cmd?skin=root&style=main", // default skin and default style
  uploadImagesUrlPath: "upload.cmd",
  catalogImagesUrlPath: "catalog-images"
}