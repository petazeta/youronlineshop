// It searchs for the theme (child of descendants) from prop id as search
import {detectLinker} from './linkermixin.mjs';

export function findTheme(search, themeMum){
  if (typeof search== "string") search={id: search};
  if (!search) {
    if (detectLinker(themeMum)) return themeMum.getChild();
    return themeMum;
  }
  function innerFind(search, myTree) {
    if (!myTree) return false;
    if (myTree.props[Object.keys(search)[0]]==Object.values(search)[0]) {
      return myTree;
    }
    for (const child of myTree.getRelationship("descendants").children) {
      let result=innerFind(search, child);
      if (result) return result;
    }
    return false;
  }
  if (detectLinker(themeMum)) return innerFind(search, themeMum.getChild());
  return innerFind(search, themeMum);
}