//var config=require('./generalcfg.json');
import {NodeFemaleMixing, NodeMaleMixing} from './../../../shared/modules/nodesmixing.js';
import Node from './../../../shared/modules/nodebasic.js'
import {findTheme} from './../../../shared/modules/themes.js';
import fs from 'fs';
import { createRequire } from "module";

const NodeFemaleBasic=NodeFemaleMixing(Node);
const NodeMaleBasic=NodeMaleMixing(Node);

class NodeFemale extends NodeFemaleBasic{
  loaddesc(source, level, thisProperties, myConstructor) {
    if (!myConstructor) return super.loaddesc(source, level, thisProperties, NodeMale);
    return super.loaddesc(source, level, thisProperties, myConstructor);
  }
  
  loadasc(source, level, thisProperties, myConstructor) {
    if (!myConstructor) return super.loadasc(source, level, thisProperties, NodeMale);
    return super.loadasc(source, level, thisProperties, myConstructor);
  }
}

class NodeMale extends NodeMaleBasic{
  loaddesc(source, level, thisProperties, myConstructor) {
    if (!myConstructor) return super.loaddesc(source, level, thisProperties, NodeFemale);
    return  super.loaddesc(source, level, thisProperties, myConstructor);
  }
  
  loadasc(source, level, thisProperties, myConstructor) {
    if (!myConstructor) return super.loadasc(source, level, thisProperties, NodeFemale);
    return super.loadasc(source, level, thisProperties, myConstructor);
  }
}

const require = createRequire(import.meta.url);
const config=require('./generalcfg.json');

let themesTreeMum;
const themesPath=config.themesPath;
let themeActive;

export function startThemes(id) {
  themesTreeMum=createTree(readFolderDirectory(themesPath));
  themeActive=findTheme(id, themesTreeMum);
  return themesTreeMum;
}

function createTree(themes) {
  const parent=new NodeFemale();
  parent.props.name="descendants";
  innerCreate(themes, parent);
  return parent;
  function innerCreate(themes, parent) {
    //The tree has a root and then there could be children (at children folder)
    //each subfolder is a theme (child)
    for (let key in themes) {
      let myChild=new NodeMale();
      parent.addChild(myChild);
      myChild.props.id=key;
      myChild.props.relPath=key;
      if (parent.partnerNode) myChild.props.path=parent.partnerNode.props.path + '/children/' + key;
      else myChild.props.path=key; //is root
      
      let myBranch=new NodeFemale();
      myBranch.props.name='descendants';
      myChild.addRelationship(myBranch);
      
      let stylesBranch=new NodeFemale();
      stylesBranch.props.name='styles';
      myChild.addRelationship(stylesBranch);
      createBranch(themes[key], stylesBranch, 'css');
      
      let templatesBranch=new NodeFemale();
      templatesBranch.props.name='views';
      myChild.addRelationship(templatesBranch);
      createBranch(themes[key], templatesBranch, 'views', true);
      
      if (themes[key].children) {
        innerCreate(themes[key].children, myBranch);
      }
    }
  }
}
function createBranch(folderTree, myBranch, folderName, subfolders) {
  //branch content is the themes files or the css files
  if (folderTree[folderName]) {
    for (let key in folderTree[folderName]) {
      if (typeof folderTree[folderName][key]=="string") {
        let myNode=new NodeMale();
        myNode.props.fileName=folderTree[folderName][key];
        myNode.props.id=myNode.props.fileName.replace(/\.[^/.]+$/, '');
        myNode.props.relPath=folderName;
        if (myBranch.partnerNode) myNode.props.path=myBranch.partnerNode.props.path + '/' + myNode.props.relPath;
        else myNode.props.path=myNode.props.relPath;
        myBranch.addChild(myNode);
      }
      //sometimes for subfolders also get content
      else if (subfolders && typeof folderTree[folderName][key]=="object") {
        for (let subkey in folderTree[folderName][key]) {
          if (typeof folderTree[folderName][key][subkey]=="string") {
            let myNode=new NodeMale();
            myNode.props.fileName=folderTree[folderName][key][subkey];
            myNode.props.id=myNode.props.fileName.replace(/\.[^/.]+$/, '');
            myNode.props.relPath=folderName + '/' + key;
            if (myBranch.partnerNode) myNode.props.path=myBranch.partnerNode.props.path + '/' + myNode.props.relPath;
            else myNode.props.path=myNode.props.relPath;
            myBranch.addChild(myNode);
          }
        }
      }
    }
  }
  return myBranch;
}
function readFolderDirectory(dir) {
  let listDir={};
  fs.readdirSync(dir).forEach((sub, key)=>{
    if (sub!='.' && sub!='..') {
      if (fs.statSync(dir+'/'+sub).isDirectory()) listDir[sub]=readFolderDirectory(dir+'/'+sub);
      else listDir[key]=sub;
    }
  });
  return listDir;
}

//creates a list of templates files with paths from the theme tree
//It uses inheritance at templates not present at child themes
export function getTpFilesList(myTheme, includeSubs=false) {
  if (!myTheme || typeof myTheme == "string") {
    if (!themeActive) startThemes(myTheme);
    myTheme=themeActive;
  }
  let totTps=[];
  let result={};
  while (myTheme) {
    let themeTps=[];
    let themePaths={};
    for (const child of myTheme.getRelationship('views').children) {
      if (includeSubs || child.props.relPath.indexOf('/')==-1) { //exclude files in subfolders
        themeTps.push(child.props.id);
        themePaths[child.props.id]=themesPath + '/' + child.props.path + '/' + child.props.fileName;
      }
    }
    let newOnes=themeTps.filter(x => !totTps.includes(x));
    totTps=newOnes.concat(totTps);
    newOnes.forEach(newOne=>{
      result[newOne]=themePaths[newOne];
    });
    if (myTheme.parentNode) myTheme=myTheme.parentNode.partnerNode;
    else myTheme=null;
  }
  return result;
}