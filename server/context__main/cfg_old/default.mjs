export default {
  autoLogin: false,
  sitePath: "./loader/main",  // extern**
  layoutsPath: "./layouts", // extern**
  catalogImagesPath: "./catalog-images/main", // **
  reportsFilePath: "./logs/logs.txt",
  clientPath: "./client", // extern **
  sharedPath: "./shared", // extern **
  requestMaxSize: 1e6,
  reportsFileMaxSize: 50000, // Characteres or bytes
  timeZone: 'Europe/Madrid',
  cache: 'none', // => extern **
  requestUrlPath: "request.cmd", // **
  layoutsUrlPath: "layouts.cmd", // extern**
  uploadImagesUrlPath: "upload.cmd", // **
  catalogImagesUrlPath: "catalogimages.cmd" // **
}