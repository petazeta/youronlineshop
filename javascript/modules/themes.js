import {Node} from './nodesfront.js';
class Theme extends Node{
  //load themes scheme
  constructor(){
    super();
  }
  findTheme(search){
    if (typeof search== "string") search={id: search};
    if (!search) {
      return this.myTreeMum.getChild();
    }
    function innerFind(search, myTree) {
      if (!myTree) return false;
      if (myTree.props[Object.keys(search)[0]]==Object.values(search)[0]) {
        return myTree;
      }
      for (let child of myTree.getRelationship("descendants").children) {
        let result=innerFind(search, child);
        if (result) return result;
      }
      return false;
    }
    return innerFind(search, this.myTreeMum.getChild());
  }
}

export default Theme;