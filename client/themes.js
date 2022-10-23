// Themes style files are at css folder and the css file named common.css
// contains a common style that is combined with the selected style


import config from './cfg/main.js';
import {LinkerNode, DataNode} from './nodes.js';
import {findTheme} from './../shared/themes.mjs';

export default class SiteTheme {
  constructor(){
    this.themeTree=new DataNode();
    this.tpList=new Map();
  }
  async getTemplates() {
    if (this.tpList.size==0) {
      await this.loadTemplates(config.themeId, config.subThemeId);
    }
    return this.tpList;
  }
  async getTemplate(tpId) {
    if (!this.tpList.has('tp' + tpId)) {
      await this.loadTemplate(tpId, config.themeId, config.subThemeId);
    }
    const tpElement=this.tpList.get('tp' + tpId); // templates have "tp" prefix
    const newElement=tpElement.cloneNode(true)
    newElement.id=null;
    return newElement.content;
  }
  async getStyles() {
    return this.loadStyles(config.styleId, config.themeId, config.subThemeId);
  }
  async loadThemesTree(themeId){
    return await this.themeTree.loadRequest("get themes tree", {themeId: themeId});
  }
  async loadTemplates(themeId, subThemeId) {
    // loading the theme templates
    const myParent=document.createElement("div");
    myParent.innerHTML= await DataNode.makeRequest("get templates content", {themeId: themeId, subThemeId: subThemeId});
    while (myParent.childNodes.length > 0) {
      if (myParent.childNodes[0].tagName=="TEMPLATE") this.tpList.set(myParent.childNodes[0].id, myParent.childNodes[0]);
      myParent.removeChild(myParent.childNodes[0]);
    }
    return this.tpList;
  }
  async loadTemplate(tpId, themeId, subThemeId) {
    // loading the theme templates
    const myParent=document.createElement("div");
    myParent.innerHTML= await DataNode.makeRequest("get template content", {tpId: tpId, themeId: themeId, subThemeId: subThemeId});
    while (myParent.childNodes.length > 0) {
      if (myParent.childNodes[0].tagName=="TEMPLATE") this.tpList.set(myParent.childNodes[0].id, myParent.childNodes[0]);
      myParent.removeChild(myParent.childNodes[0]);
    }
    return this.tpList;
  }
  async loadStyles(styleId, themeId, subThemeId) {
    // loading the theme templates
    const myParent=document.createElement("div");
    myParent.innerHTML = await DataNode.makeRequest("get css content", {styleId: styleId, themeId: themeId, subThemeId: subThemeId});
    for (const style of myParent.querySelectorAll("style")) {
      document.head.appendChild(style);
    }
  }
}

/*
// For the most common case (loadViewsAtOnce & viewsCacheOn) tpList becomes a Map: tp id => tp content
export const tpList=new Map();
const themesTreeMum=new LinkerNode();

export let themeActive, styleActive;

export async function startTheme(id){
  let mainId, subId;
  if (id.includes('/')) {
    [mainId, subId] = id.split('/');
  }
  else {
    mainId=subId=id;
  }
  if (config.loadViewsAtOnce!=false && config.viewsCacheOn!=false) {
    // loading the theme templates
    const myParent=document.createElement("div");
    myParent.innerHTML= await loadAllViews();
    while (myParent.childNodes.length > 0) {
      if (myParent.childNodes[0].tagName=="TEMPLATE") tpList.set(myParent.childNodes[0].id, myParent.childNodes[0]);
      myParent.removeChild(myParent.childNodes[0]);
    }
  }
  if (!themesTreeMum.getChild()) await loadThemesTree(id);
  themeActive=findTheme(subId, themesTreeMum);
  if (!themeActive) themeActive=themesTreeMum.getChild();
  styleActive=themeActive.getRelationship("styles").getChild({id: config.styleId});
  applyCommonStyle(themeActive);
  applyCss(config.themesPath + '/' + styleActive.props.path + '/' +styleActive.props.fileName);
  themeActive.dispatchEvent("loaded");
  themeActive.notifyObservers("loaded");
  return themeActive;
}

function loadThemesTree(themeId, subThemeId){
  return themesTreeMum.loadRequest("get themes tree", {themeId: themeId, subThemeId: subThemeId});
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
    common=common.parent.partner;
  }
}

export function changeStyle(parameter){
  let styleNode=null;
  //removing document styles
  const styles=document.head.querySelectorAll('link[rel=stylesheet]');
  for (const myStyle of styles) {
    if (myStyle.href.indexOf(themeActive.getRelationship("styles").getChild({id: "common"}).props.fileName)==-1) document.head.removeChild(myStyle);
  }
  if (typeof parameter == "number") styleNode= themeActive.getRelationship("styles").children[parameter];
  if (typeof parameter == "string") {
    styleNode = themeActive.getRelationship("styles").children.find(childNode => childNode.props.id==parameter)
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
  while (themeNode) {
    let tpNode = themeNode.getRelationship(VIEWS_FOLDER).children.find(myChild => myChild.props.id==id);
    if (tpNode) {
      return config.themesPath + '/' + tpNode.props.path + '/' + tpNode.props.fileName;
    }
    themeNode=themeNode.parent.partner;
  }
}
*/