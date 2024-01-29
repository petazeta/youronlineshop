import prepareTpScriptsBasic from '../viewcomponent.mjs';

const thisAppFolder = new URL(import.meta.url).pathname.split("/").slice(-2).shift()

export default function prepareTpScripts(tp, params={}) {
  return prepareTpScriptsBasic(tp, params, thisAppFolder)
}

// experimental
export function prepareTpScriptsComponent(tp, thisNode, params={}){
  return document.createElement('view-element').prepareTpScripts(tp, thisNode, params, thisAppFolder)
}