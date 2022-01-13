import {loadText} from './pagescontent.js';
import {setActive} from './activenode.js';
import {getLastActive} from './centrallastactive.js';

export  async function setMenus(){
  const pagesText=await loadText();
  const menusRoot=pagesText;
  const menusMother=pagesText.getRelationship();
  /********
  // Event for refreshing categories when log
  combineFromMixing(ObserverMixing, menusRoot); // We add observers characteristics to cats
  // We attach the observer to the user
  webuser.attachObserver(pagesText, "log");
  menusRoot.noticeReactions.set("log", (params)=>{
    console.log(`menusRoot id=${menusRoot.props.id} said "webuser log ${params.lastType + '=>' + params.currentType}"`);
    if (params.lastType!=params.currentType) menusRoot.getRelationship('pageelements').setChildrenView();
  });
  */
  //When no children and admin we create the plus add button and click on int
  menusMother.addEventListener("setChildrenView", async function() {
    if (webuser.isWebAdmin() && this.children.length==0) {
      const newNode = await this.createInstanceChildText();
      newNode.setView(this.childContainer, "butaddnewnode");
    }
  }, "addNewNodeButton");
  //when a new menu is created we select it
  menusMother.addEventListener("addNewNode", function(newNode) {
    const url='?menu=' + newNode.props.id;
    if (!(history.state && history.state.url==url)) { //to not repeat state
      history.pushState({url:url}, null, url);
    }
    setActive(newNode);
    newNode.setView(document.getElementById("centralcontent"), "doc");
  }, "addANewNode");
  menusMother.addEventListener("deleteChildNode", function(delNode) {
    //Remove the menus -> central container content
    if (this.children.length==0 && delNode==getLastActive()) {
      document.getElementById("centralcontent").innerHTML="";
    }
    //when a del menu was selected we click the previous
    if (delNode.selected 
    && this.getMySysKey("sort_order")
    && this.children.length>0) {
      let position=1;
      if (delNode.props[this.getMySysKey("sort_order")] > 1) position=delNode.props[this.getMySysKey("sort_order")]-1;
      const url='?menu=' + this.children[position-1].props.id;
      if (!(history.state && history.state.url==url)) { //to not repeat state
        history.pushState({url:url}, null, url);
      }
      setActive(this.children[position-1]);
      this.children[position-1].setView(document.getElementById("centralcontent"), "doc");
    }
  }, "delANewNode");
  return menusMother;
}