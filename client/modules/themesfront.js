import config from './../cfg/main.js';
import {Node, NodeMale, NodeFemale} from './nodesfront.js';
import {findTheme} from './../../shared/modules/themes.js';

export const tpList=new Map();
const themesTreeMum=new NodeFemale();

export let themeActive, styleActive;

export async function startTheme(id){
  let mainId, subId;
  if (id.includes('/')) {
    [mainId, subId] = id.split('7');
  }
  else {
    mainId=subId=id;
  }
  if (config.loadViewsAtOnce!=false && config.viewsCacheOn!=false) {
    let myParent=document.createElement("div");
    myParent.innerHTML= await loadAllViews();
    while (myParent.childNodes.length > 0) {
      if (myParent.childNodes[0].tagName=="TEMPLATE") tpList.set(myParent.childNodes[0].id, myParent.childNodes[0]);
      myParent.removeChild(myParent.childNodes[0]);
    }
  }
  if (!themesTreeMum.getChild()) await loadThemesTree(id);
  themeActive=findTheme(subId, themesTreeMum);
  if (!themeActive) themeActive=themesTreeMum.getChild();
  //themeActive.themePath=config.themesPath + '/' + themeActive.props.path; //Deprecated
  styleActive=themeActive.getRelationship("styles").getChild({id: config.styleId});
  applyCommonStyle(themeActive);
  applyCss(config.themesPath + '/' + styleActive.props.path + '/' +styleActive.props.fileName);
  //this.componentsPath=this.active.themePath + '/' + config.componentsRelativePath + '/'; //OLD
  themeActive.dispatchEvent("loaded");
  return themeActive;
}

function loadThemesTree(id){
  return themesTreeMum.loadRequest("get themes tree", {id: id});
}

function loadAllViews(url){
  if (!url) url=config.loadAllComponentsFilePath;
  return fetch(url, {
    method: 'post',
    body: JSON.stringify({theme_id: config.themeId}),
  })
  .then(res => res.text());
}

function applyCss(href){
  const cssLink=document.createElement("link");
  cssLink.rel="stylesheet";
  cssLink.type="text/css";
  cssLink.href=href;
  document.head.appendChild(cssLink);
}

function applyCommonStyle(common){
  while (common) {
    let myNode=null;
    common.getRelationship("styles").children.some(cmNode=>{
      if (cmNode.props.id=="common") {
        myNode=cmNode;
        return true;
      }
    });
    if (myNode) {
      applyCss(config.themesPath + '/' + myNode.props.path + '/' + myNode.props.fileName);
      break;
    }
    common=common.parentNode.partnerNode;
  }
}

export function changeStyle(parameter){
  let styleNode=null;
  //removing document styles
  let styles=document.head.querySelectorAll('link[rel=stylesheet]');
  for (let i=0; i<styles.length; i++) {
    if (styles[i].href.indexOf(themeActive.getRelationship("styles").getChild({id: "common"}).props.fileName)==-1) document.head.removeChild(styles[i]);
  }
  if (typeof parameter == "number") styleNode= themeActive.getRelationship("styles").children[parameter];
  if (typeof parameter == "string") {
    for (const child of  themeActive.getRelationship("styles").children) {
      if (child.props.id==parameter) {
        styleNode=child;
        break;
      }
    }
  }
  else {
    //we go walking for every style
    let activeIndex=-1;
    let children=themeActive.getRelationship("styles").children;
    let childrenCopy=[];
    for (const child of children) {
      if (child.props.id!='common') { //remove common.css from search
        let index=childrenCopy.push(child)-1;
        if (child==styleActive) activeIndex=index;
      }
    }
    activeIndex++;
    if (activeIndex>=childrenCopy.length) {
      activeIndex=0; //back to begining
    }
    styleNode=childrenCopy[activeIndex];
  }
  //Apply the css
  if (styleNode.props.id!="common") {
    applyCss(config.themesPath + '/' + styleNode.props.path + '/' + styleNode.props.fileName);
    styleActive=styleNode;
    return styleNode;
  }
}

export function getTpPath(themeNode, id){
  let tpNode=null;
  while (themeNode) {
    for (const child of themeNode.getRelationship(VIEWS_FOLDER).children) {
      if (child.props.id==id) {
        tpNode=child;
        break;
      }
    }
    if (tpNode) {
      return config.themesPath + '/' + tpNode.props.path + '/' + tpNode.props.fileName;
    }
    themeNode=themeNode.parentNode.partnerNode;
  }
}