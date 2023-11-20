export const config = new Map([
  ["layouts-url-path", "layouts.cmd"],  // Defaults: skin => "root", style => "main". You can configure other defaults => layouts.cmd?skin=my_default_skin&style=my_default_style
  ["layouts-folder-path", "./layouts"],
  ["cache", "none"], // mem | none. Default mem
  ["loader-path", "./loader/main"],
  ["client-path", "./client"],
  ["shared-path", "./shared"], // shared and client should have a common parent folder
  ["images-path", "./catalog-images/main"],
  ["request-url-path", "request.cmd"],
  ["layouts-url-path", "layouts.cmd"],
  ["upload-images-url-path", "upload.cmd"],
  ["catalog-images-url-path", "catalogimages.cmd"],
  ["reports-url-path", "reports.cmd"],
  ["reports-file-maxsize", 50000],
  ["reports-file-path", "./logs/logs.txt"],
  ["db-url", "mongodb://admin:password@localhost/"],
  ["request-max-size", 1e6],
  ["timeZone", "Europe/Madrid"],
  ["db-import-path", "./server/utils"],
])