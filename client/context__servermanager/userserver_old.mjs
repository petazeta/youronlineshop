import {Node} from './nodesserver.mjs'
import userMixin from '../../usermixin.mjs'
import makeReport from './reportsserver.mjs';

const User = userMixin(sharedUserMixin(Node));
User.makeReport=makeReport

export default User;

export async function loginDashboard(webuser, textNode){
  // close login card
  const loginCard=document.getElementById("login-card")
  loginCard.parentElement.removeChild(loginCard);
  if (webuser.isAdmin()) {
    async function blink(domElement){
      function innerBlink(){
        domElement.dispatchEvent(new Event('mouseover'));
        setTimeout(()=>domElement.dispatchEvent(new Event('mouseout')), 500);
      }
      innerBlink();
      const intervalActive=setInterval(innerBlink, 1000);
      setTimeout(()=>clearInterval(intervalActive), 2000);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    if (webuser.isProductAdmin()) {
      const {getRoot} = await import('./categoriesserver.mjs');
      for (const cat of getRoot().getMainBranch().children) {
        blink(cat.highLightElement.parentElement);
      }
    }
    if (webuser.isWebAdmin()) {
      const {getRoot} = await import('./pagesserver.mjs');
      for (const menu of getPageText().getMainBranch().children) {
        blink(menu.highLightElement.querySelector('a.menu'));
      }
      console.log(window.document.querySelector('.pgtitle h1 div'));
      blink(window.document.querySelector('.pgtitle h1 div'));
    }
    return; // No dashboard screen no need to do anything
  }
  // if cart it is not empty -> redirect to checkout
  const {myCart} = await import('./cartserver.mjs')
  const {setActiveInGroup} = await import('./activeingroup.mjs')
  if (myCart.getRelationship().children.length>0) {
    setActiveInGroup('central content', textNode.parent.getChild("checkout"));
    textNode.parent.getChild("checkout").setView(document.getElementById("centralcontent"), 'chktmain');
  }
  else {
    setActiveInGroup('central content', textNode.parent.getChild("dashboard"));
    textNode.parent.getChild("dashboard").setView(document.getElementById("centralcontent"), "showuserinfo");
  }
}

