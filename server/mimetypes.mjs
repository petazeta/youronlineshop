import {parse as pathParse} from "path";

export default function getMimeType(filename) {
  const fileExt = pathParse(filename).ext.slice(1)
  return mimeTypes.get(fileExt) || "text/plain"
}

const mimeTypes = new Map([
  ["html", "text/html"],
  ["htm", "text/html"],
  ["js", "text/javascript"],
  ["mjs", "text/javascript"],
  ["css", "text/css"],
  ["svg", "image/svg+xml"],
  ["gif", "image/gif"],
  ["jpeg", "image/jpeg"],
  ["jpg", "image/jpeg"],
  ["png", "image/png"],
  ["ico", "image/x-icon"],
  ["webp", "image/webp"],
])