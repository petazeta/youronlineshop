import basicMixin from './../shared/basicmixin.mjs';
import linksMixin from './../shared/linksmixin.mjs';
import {BasicLinker, BasicNode} from './../shared/linker.mjs';
import fs from 'fs';
import path from 'path';

class Linker extends BasicLinker {};
class Node extends BasicNode {};

Node.linkerConstructor=Linker;
Linker.nodeConstructor=Node;

export default function createTree(folderPath) {
  const viewsFolderName="views";
  const cssFolderName="css";
  const rootFolderName = path.basename(folderPath);
  const root = {[rootFolderName]: readFolderDirectory(folderPath)};
  const parent=new Linker();
  parent.props.name="descendants";
  innerCreate(root, parent);
  return parent.getChild();
  function innerCreate(themes, parent) {
    //The tree has a root and then there could be children (at children folder)
    //each subfolder is a theme (child)
    for (const key in themes) {
      let myChild=new Node();
      parent.addChild(myChild);
      myChild.props.id=key;
      myChild.props.relPath=key;
      if (parent.partner) myChild.props.path=parent.partner.props.path + '/children/' + key;
      else myChild.props.path=key; //is root
      
      let myBranch=new Linker();
      myBranch.props.name='descendants';
      myChild.addRelationship(myBranch);
      
      let stylesBranch=new Linker();
      stylesBranch.props.name='styles';
      myChild.addRelationship(stylesBranch);
      createBranch(themes[key], stylesBranch, cssFolderName, true);
      
      let templatesBranch=new Linker();
      templatesBranch.props.name=viewsFolderName;
      myChild.addRelationship(templatesBranch);
      createBranch(themes[key], templatesBranch, viewsFolderName, true);
      
      if (themes[key].children) {
        innerCreate(themes[key].children, myBranch);
      }
    }
  }
}

function createBranch(folderTree, myBranch, folderName, subfolders) {
  if (folderTree[folderName]) {
    for (const key in folderTree[folderName]) {
      if (typeof folderTree[folderName][key]=="string") {
        let myNode=new Node();
        myNode.props.fileName=folderTree[folderName][key];
        myNode.props.id=myNode.props.fileName.replace(/\.[^/.]+$/, '');
        myNode.props.relPath=folderName;
        if (myBranch.partner) myNode.props.path=myBranch.partner.props.path + '/' + myNode.props.relPath;
        else myNode.props.path=myNode.props.relPath;
        myBranch.addChild(myNode);
      }
      //sometimes for subfolders also get content
      else if (subfolders && typeof folderTree[folderName][key]=="object") {
        for (const subkey in folderTree[folderName][key]) {
          if (typeof folderTree[folderName][key][subkey]=="string") {
            let myNode=new Node();
            myNode.props.fileName=folderTree[folderName][key][subkey];
            myNode.props.id=myNode.props.fileName.replace(/\.[^/.]+$/, '');
            myNode.props.relPath=folderName + '/' + key;
            if (myBranch.partner) myNode.props.path=myBranch.partner.props.path + '/' + myNode.props.relPath;
            else myNode.props.path=myNode.props.relPath;
            myBranch.addChild(myNode);
          }
        }
      }
    }
  }
  return myBranch;
}

// Generic function to read a directory tree:
// root.views => {exload: {0: "export.html"}, 1: "alert.html"}
function readFolderDirectory(dir) {
  const listDir={};
  fs.readdirSync(dir).forEach((sub, key)=>{
    if (sub!='.' && sub!='..') {
      if (fs.statSync(dir+'/'+sub).isDirectory()) listDir[sub]=readFolderDirectory(dir+'/'+sub);
      else listDir[key]=sub;
    }
  });
  return listDir;
}