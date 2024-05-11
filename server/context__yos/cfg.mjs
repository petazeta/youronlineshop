export const config = new Map([
  ["layouts-url-path", "layouts.cmd"],  // Defaults: skin => "default", style => "default". You can configure other defaults => layouts.cmd?skin=my_default_skin&style=my_default_style
  ["layouts-folder-path", "./layouts/yos"],
  ["cache", "none"], // mem | none. Default: mem
  ["client-path", "./client"],
  ["shared-path", "./shared"], // shared and client should have a common parent folder
  ["request-url-path", "request.cmd"],
  ["upload-images-url-path", "upload.cmd"],
  ["catalog-images-url-path", "catalogimages.cmd"],
  ["reports-url-path", "reports.cmd"],
  ["reports-file-maxsize", 50000],
  ["reports-file-path", "./logs/logs.txt"],
  ["request-max-size", 1e6],
  ["timeZone", "Europe/Madrid"],
  ["db-import-file-path","./data/yos/db.json"],
  ["db-schema-file-path","./data/yos/schema.json"],
  ["db-permissions-file-path","./data/yos/permissions.json"],
  ["db-root-folder-path","./data/yos"],
  ["db-mode",[["cache", ["SiteElements", "SiteElementsData"]]]],
  ["loader-path","./loader/yos"],
  ["proxy",true],
])