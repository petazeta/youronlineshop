/*
Layouts element

- ThemeRoot dataNode
  - Rel descendants :  [...]
  - Rel styles: [css files]
  - Rel views: [html files: {id, fileName, path, relPath}]

id is the filename without the extension

We need the root theme as well as the subtheme (activeTheme) because we would need to search at parent layouts for files not present at subtheme.
*/

import readTree from './layoutfolderread.mjs';
import fs from 'fs';
import path from 'path';

export default class SiteLayout {
  constructor(layoutsPath){
    this.treeRoot;
    this.layoutsPath=layoutsPath;
    this.layoutsPath=layoutsPath;
  }
  readTree(themeId){
    this.treeRoot=readTree(path.join(this.layoutsPath, themeId));
  }
  getTpFilesList(themeId, subThemeId, excluded=false) {
    if (!this.treeRoot || this.treeRoot.props.id!=themeId) this.readTree(themeId);
    let active = this.treeRoot;
    if (subThemeId) active = this.findTheme(subThemeId);
    return getTpFilesList(this.layoutsPath, active, excluded);
  }
  getCssFilesList(themeId, subThemeId) {
    if (!this.treeRoot || this.treeRoot.props.id!=themeId) this.readTree(themeId);
    let active = this.treeRoot;
    if (subThemeId) active = this.findTheme(subThemeId);
    return getCssFilesList(this.layoutsPath, active);
  }
  getContent(themeId, subThemeId) {
    return Array.from(this.getTpFilesList(themeId, subThemeId)).reduce((cc, [tpId, tpFilePath])=>cc+=getTp(tpId, tpFilePath), '');
    //header('Access-Control-Allow-Origin: *'); //To allow use of external
  }
  getTpContent(tpId, themeId, subThemeId){
    return getTp(tpId, this.getTpFilesList(themeId, subThemeId, true).get(tpId));
  }
  getCssImagePath(imageId, themeId, subThemeId){
    const fileList=this.getCssFilesList(themeId, subThemeId);
    return fileList.get(imageId);
  }
  // It searchs for the theme (child of descendants) from prop id as search
  findTheme(search) {
    if (typeof search== "string") search={id: search};
    if (!search) {
      return this.treeMum.getChild();
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
    return innerFind(search, this.treeMum.getChild());
  }
  getCssContent(styleId, themeId, subThemeId){
    if (!this.treeRoot || this.treeRoot.props.id!=themeId) this.readTree(themeId);
    let active = this.treeRoot;
    if (subThemeId) active = this.findTheme(subThemeId);
    const cssContent= [getCommonStyle(this.layoutsPath, active), getStyle(this.layoutsPath, styleId, active)].reduce((cc, cssFilePath)=>cc+=getCss(cssFilePath), '');
    return encondeCssImageNames(cssContent, themeId, subThemeId);
  }
}

function getTp(tpId, tpFilePath) {
  return "<template id='tp" + tpId + "'>\n" + fs.readFileSync(tpFilePath, {encoding: "utf8"}) + "\n</template>\n";
}
function getCss(cssFilePath) {
  if (!cssFilePath) return '';
  return "<style>\n" + fs.readFileSync(cssFilePath, {encoding: "utf8"}) + "\n</style>\n";
}

export function decodeCssImageUrlPath(imageUrlPath){
  const imageFileName=path.basename(imageUrlPath);
  const ImageData=new Map();
  ImageData.set("imageId", imageFileName.split('.')[0].split('_')[0]);
  ImageData.set("themeId", imageFileName.split('.')[0].split('_')[1]);
  ImageData.set("subThemeId", imageFileName.split('.')[0].split('_')[2]);
  return ImageData;
}

function encondeCssImageNames(cssContent, themeId, subThemeId){
  let searchParams='';
  if (themeId) searchParams += '_' + themeId;
  if (subThemeId) searchParams += '_' + subThemeId;
  return cssContent.replaceAll('.svg', searchParams + '.svg');
}

// It creates a list of templates files with paths from the theme tree
// ***** It uses inheritance at templates not present at child layouts
// Option includeSubs is to include template files at subfolders of the view folder. We usually reserve the subfolder to save the templates that are not loaded with the others at the begining because they are not often accesed.
function getTpFilesList(layoutsPath, myTheme, includeSubs=false) {
  return getFilesList(layoutsPath, "views", myTheme, includeSubs);
}

function getCssFilesList(layoutsPath, myTheme) {
  return getFilesList(layoutsPath, "styles", myTheme, true);
}

function getFilesList(layoutsPath, folderName, myTheme, includeSubs=false) {
  let pointer=myTheme;
  const result=new Map();
  while (pointer) {
    if (!pointer.getRelationship(folderName)) break;
    for (const child of pointer.getRelationship(folderName).children) {
      if (includeSubs || !child.props.relPath.match(/.+\/.+/)) { //exclude files in subfolders
        if (!result.has(child.props.id)) result.set(child.props.id, path.join(layoutsPath, child.props.path, child.props.fileName));
      }
    }
    if (pointer.parent) pointer=pointer.parent.partner;
    else break;
  }
  return result;
}

// common style can be at the activetheme or if not it search in ascendents
function getCommonStyle(layoutsPath, activeTheme){
  return getStyle(layoutsPath, "common", activeTheme)
}

function getStyle(layoutsPath, styleId, activeTheme) {
  const myList = getCssFilesList(layoutsPath, activeTheme);
  return myList.get(styleId);
}