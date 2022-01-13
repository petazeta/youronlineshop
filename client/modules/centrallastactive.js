//import {themeActive} from './themesfront.js';
import {unsetActiveChild} from './activenode.js';
//must be instanced after the theme has been created

//we keep noticing last node active.
export let lastActive;
export function watchLastActive(){

}
export function setLastActive(launcher) {
  let central=document.getElementById("centralcontent") ;
  if (launcher.myContainer==central || launcher.childContainer==central || launcher.propsContainer==central) {
    if (lastActive!=launcher) {
      if (lastActive && lastActive.selected) unsetActiveChild(lastActive); //To remove highlight for the anchor
      lastActive=launcher; //add new button also uses this statement
    }
  }
}

export function getLastActive(){
  return lastActive;
}
/*
export function dispatchLastActive(launcher){
  themeActive.dispatchEvent("setTp", launcher); //This way we save the last node that has a view
}
??*/