import {loadText} from './pagescontent.js';
import {getActiveInGroup} from './activelauncher.js';
import {createInstanceChildText} from './languages.js';
import {pushHistoryState} from './navhistory.js';

export function docView(menuNode){
  menuNode.setView(document.getElementById("centralcontent"), "doc");
  const url='?menu=' + menuNode.props.id;
  pushHistoryState(url);
}

export async function setMenus(){
  const pagesText=await loadText();
  const menusRoot=pagesText;
  const menusMother=pagesText.getRelationship();

  //When no children and admin we create the plus add button and click on int
  menusMother.addEventListener("setChildrenView", async function() {
    if (webuser.isWebAdmin() && this.children.length==0) {
      const newNode = await createInstanceChildText(this);
      newNode.setView(this.childContainer, "butaddnewnode");
    }
  }, "addNewNodeButton");
  //when a new menu is created we select it
  menusMother.addEventListener("addNewNode", function(newNode) {
    const url='?menu=' + newNode.props.id;
    if (!(history.state && history.state.url==url)) { //to not repeat state
      history.pushState({url:url}, null, url);
    }
    newNode.setView(document.getElementById("centralcontent"), "doc");
  }, "addANewNode");
  menusMother.addEventListener("deleteChildNode", function(delNode) {
    //Remove the menus -> central container content
    if (this.children.length==0 && delNode===getActiveInGroup('central content')) {
      document.getElementById("centralcontent").innerHTML="";
    }
    //when a del menu was selected we click the previous
    if (delNode.selected 
    && this.getSysKey("sort_order")
    && this.children.length>0) {
      let position=1;
      if (delNode.props[this.getSysKey("sort_order")] > 1) position=delNode.props[this.getSysKey("sort_order")]-1;
      docView(this.children[position-1]);
    }
  }, "delANewNode");
  return menusMother;
}