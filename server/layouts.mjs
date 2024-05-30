import {BasicLinker, BasicNode} from '../shared/linker.mjs';
import {walkThrough, walkThroughAsync} from '../shared/utils.mjs';
import {createReadStream, promises as fs} from 'fs';
import * as path from 'path';
import {pipeline} from 'stream'
import {streamErrorGuard} from "./errors.mjs"

// This class serves as a container for the layout tree
// The layout tree contains the child skin node and grandchild subskin nodes

// **** no tiene sentido crear una clase skin que puede mutar a otra skin, mejor revisar esto
// crear un objeto superior para esto cargar la skin segun la skin id

export class SkinsTree {
  constructor(layoutsPath){
    this.treeRoot = new BasicNode({path: layoutsPath})
    this.treeRoot.addRelationship(new BasicLinker())
    this.treeRoot.getRelationship().props.name='descendents'
  }
  // create
  async createTree(){
    for (const skinId of (await fs.readdir(this.treeRoot.props.path)))
      await this.createTreeFromSkin(skinId)
  }
  async createTreeFromSkin(skinId){
    this.treeRoot.getRelationship().addChild(await readTree(path.join(this.treeRoot.props.path, skinId)))
  }
  // This method can be called at the beginning to load the tree based in the skinId
  async getSkin(skinId) {
    if (!findSkinNode(skinId, this.treeRoot, 1))
      // read and load tree elements when not present
      console.log("Retrieving skin: " + skinId)
      await this.createTreeFromSkin(skinId)
    return findSkinNode(skinId, this.treeRoot, 1)
  }
  // return a string containing the templates of the skin: <template id='x'>...</template><template id='y'>...</template> [...]
  // Template id will be: 'tp_' + filename without extension
  async writeAllTpContent(response, skinId, subSkinId) {
    for (const tpFilePath of await this.getTpFileList(skinId, subSkinId, ["ondemand"])) {
      const readStream = getTpStream(tpFilePath)
      streamErrorGuard(readStream, response)
      for await (const chunk of readStream) {
        response.write(chunk)
      }
    }
    response.end()
  }
  async writeTpContent(response, skinId, subSkinId, tpId){
    const tpFilePath = (await this.getTpFileList(skinId, subSkinId))
        .find(tpPath=>path.basename(tpPath).split('.')[0] == tpId)
    const readStream = getTpStream(tpFilePath)
    streamErrorGuard(readStream, response)
    for await (const chunk of readStream) {
      response.write(chunk)
    }
    response.end()
  }
  // css content with images embedded
  async writeCssContent(response, skinId, subSkinId, styleId){
    let activeSkin = await this.getSkin(skinId) // read skin node tree if not already read
    if (subSkinId)
      activeSkin = findSkinNode(subSkinId, activeSkin)
    const cssFileList = (await this.getCssFileList(skinId, subSkinId))
        .filter(cssFilePath=>path.relative(this.treeRoot.props.path, cssFilePath).split(path.sep)[2] == styleId)
    response.write("<style>\n")
    for (const tpFilePath of cssFileList.filter(cssFilePath=>path.basename(cssFilePath).split('.')[1] == 'css')) {
      const readStream = getCssStream(cssFileList, tpFilePath)
      streamErrorGuard(readStream, response)
      for await (const chunk of readStream) {
        response.write(chunk)
      }
    }
    response.end("</style>\n")
  }
  // excluded => check getFileList
  async getTpFileList(skinId, subSkinId, excluded=false) {
    return await this.getFileList(skinId, subSkinId, 'views', excluded)
  }
  async getCssFileList(skinId, subSkinId, excluded=false) {
    return await this.getFileList(skinId, subSkinId, 'styles', excluded)
  }
  // return the list of files from a branch node (It follows inheritance)
  // excluded===true => exclude files in subfolders, excluded==[...subfolders] exclude those subfolders
  async getFileList(skinId, subSkinId, branchName, excluded=false) {
    if (typeof(excluded)!="boolean" && !Array.isArray(excluded)) throw new Error("invalid parameter excluded")
    const activeSkin = await this.getSkin(skinId) // read skin node tree if not already read
    const activeSubSkin = subSkinId ? findSkinNode(subSkinId, activeSkin) : null
    if (activeSubSkin) {
      const listViewsFilesPaths = myNode=>myNode.getRelationship(branchName)?.children.map(child=>[child.props.path, myNode.props.path])
      const mergeFilesInBranches = (branch, listViewsChildTotal)=>{ // hacerlo para cualquier numero de argumentos, la prioridad la marca el orden
        let listViews=listViewsFilesPaths(branch)
        if (!listViewsChildTotal) return listViews
        if (!listViews) return listViewsChildTotal

        for (let [viewPath, skinPath] of listViews) {
          let match=listViewsChildTotal.find(([viewPathChild, skinPathChild])=>path.basename(viewPathChild)==path.basename(viewPath))
          if (!match) listViewsChildTotal.push([viewPath, skinPath])
        }
        return listViewsChildTotal
      }
      const myIterable = walkThrough(activeSubSkin, myElement=>myElement.getParent()?.getPartner() ? [myElement.getParent().getPartner()] : [], mergeFilesInBranches)
      let myLastIteration, myNextIteration = myIterable.next()
      while (!myNextIteration.done) {
        myLastIteration=myNextIteration
        myNextIteration=myIterable.next()
      }
      return myLastIteration.value
      .filter(([viewPath, skinPath])=> excluded==false || Array.isArray(excluded) && !excluded.includes(viewPath.split('/')[viewPath.split('/').length-2]) || excluded===true && skinPath.split('/').length - viewPath.split('/').length==-2)
      .map(([viewPath, skinPath])=>viewPath)
      // it is not subfolder: number of elements between slashes = folders + file
    }
    else {
      return activeSkin.getRelationship(branchName).children
      .map(viewChild=>viewChild.props.path)
      .filter(viewPath=> excluded==false || Array.isArray(excluded) && !excluded.includes(viewPath.split('/')[viewPath.split('/').length-2]) || excluded===true && activeSkin.props.path.split('/').length - viewPath.split('/').length==-2) // if excluded subfolder check it is not subfolder
    }
  }
}

// -- helpers

function getTpStream(tpFilePath) {
  const readStream = createReadStream(tpFilePath)
  return pipeline(readStream, setTpTag(path.basename(tpFilePath).split('.')[0]), (err)=>{
    if (err) {
      readStream.destroy()
      console.error("pipeline error at: " + tpFilePath, err)
    }
  })
}

function getCssStream(cssFileList, cssFilePath) {
  const readStream = createReadStream(cssFilePath)
  const svgRegExp = /url\(images\/(.+?)\.svg\)/
  return pipeline(readStream, fixBoundaryInBetween(svgRegExp), fixBoundaryInBetween(svgRegExp), setSvgCss(cssFileList), (err)=>{
    if (err) {
      readStream.destroy()
      console.error("pipeline error at: " + cssFilePath, err)
    }
  })
}

// It searchs for the skin (child of descendents)
const findSkinNode = (skinId, rootNode, depth=-1) => walkThrough(rootNode, myElement=>myElement.getRelationship('descendents')?.children, undefined, undefined, resultElement=>path.basename(resultElement.props.path)==path.basename(skinId), undefined, depth)
  .next()
  .value

function setTpTag(tpId) {
  return async function * setTpTagIter(source) {
    yield `<template id='tp_${tpId}'>\n`
    for await (const chunk of source) {
      yield chunk
    }
    yield "\n</template>\n"
  }
}
function setSvgCss(cssFileList) {
  return async function * setSvgIter(source) {
    for await (const chunk of source) {
      yield await setSvg(chunk.toString())
    }
    // falta el caso que quede el contenido entre medias de dos chunks
    async function setSvg(cssContent) {
      const imageNamesIter = cssContent.matchAll(/url\(images\/(.+?)\.svg\)/g);
      let cssSvg = cssContent
      for (const [_, imageId] of imageNamesIter) {
        let imagePath = cssFileList.find(cssFilePath=>path.basename(cssFilePath).split('.')[1]=='svg' && path.basename(cssFilePath).split('.')[0]==imageId)
        if (!imagePath) continue;
        let svgImageData = (await fs.readFile(imagePath, {encoding: "utf8"})).toString()
        let svgImage64Data = btoa(svgImageData)
        //svgImageData=svgImageData.replaceAll("'", '"').replaceAll("\n", '').replaceAll('#', '%23');

        const imgWidthMatch = svgImageData.match(/width=[',"](.+?)[',"]/), imgHeightMatch=svgImageData.match(/height=[',"](.+?)[',"]/)
        if (Array.isArray(imgWidthMatch) && imgWidthMatch[1] && Array.isArray(imgHeightMatch) && imgHeightMatch[1]) {
          let imgWidth = imgWidthMatch[1], imgHeight=imgHeightMatch[1]
          if (!isNaN(imgWidth)) imgWidth += 'px'
          if (!isNaN(imgHeight)) imgHeight += 'px'
          let cssSizeContent = `\nwidth: ${imgWidth}; height: ${imgHeight};\n`
          cssSvg = cssSvg.replaceAll(new RegExp(`images\/${imageId}.svg.+?;`, 'g'), '$&' + cssSizeContent)
        }
        //svgImage=encodeURIComponent(svgImage);
        //cssSvg=cssSvg.replaceAll(new RegExp("'?" + 'images\/' + imageId + '.svg' + "'?", 'g'), `'data:image/svg+xml;utf8,${svgImageData}'`);
        cssSvg = cssSvg.replaceAll(new RegExp("'?" + 'images\/' + imageId + '.svg' + "'?", 'g'), `'data:image/svg+xml;base64,${svgImage64Data}'`);
      }
      return cssSvg
    }
  }
}
// When manipulating files in streams there is a problem if the element to be manipulated comes in between chunks
function fixBoundaryInBetween(regExp) {
  return async function * fixBoundaryInBetweenIter(source) {
    let lastChunk
    for await (const chunk of source) {
      if (lastChunk) {
        const firstLineEndPos = chunk.toString().indexOf('\n') // checking at the begining, before first new line
        if (firstLineEndPos != -1) {
          const lastLineEndPos = chunk.toString().lastIndexOf('\n') // getting the last line start position
          const leftChars = lastLineEndPos != -1 ? lastChunk.toString().length - lastLineEndPos : 0 // 0 => all the chars
          const chunksJoint = lastChunk.toString().slice(-leftChars) + chunk.toString().slice(0, firstLineEndPos)
          if (chunksJoint.match(regExp)) {  // when the match is in between chunks we join chunks
            yield Buffer.concat([lastChunk, chunk])
            lastChunk = null // we dont set lastChunk to chunk this time cause the current chunk is sent. Otherwise current chunk would be sent twice
            // Therefore we are not checking boundaries between current chunk and next
            // The easier way to solve it is to repeat twice the function in the pipeline so boundaries not checked would be checked in a second round
            continue
          }
        }
        yield lastChunk
      }
      lastChunk = chunk
    }
    if (lastChunk) yield lastChunk // return the last pieze
  }
}

// --- layout folder read, *** revisar integrarlo con el codigo de arriba, se ha movido desde un modulo
// *** se podria hacer mediante memdbgateway, estudiarlo

async function readTree(layoutFolderPath) {
  async function layoutChildren(parentLayout) {
    if ( !(await fs.stat(parentLayout.props.path))?.isDirectory() || !(await fs.readdir(parentLayout.props.path)).includes(childrenFolderName) )
      return []
    const childrenPath = path.join(parentLayout.props.path, childrenFolderName)
    if ( !(await fs.stat(childrenPath))?.isDirectory() )
      return []
    return await Promise.all((
      await fs.readdir(childrenPath))
        .map( async sublayoutFolder =>
          parentLayout.getRelationship('descendents')
            .addChild(await createLayout(path.join(childrenPath, sublayoutFolder)))
      ) )
  }
  const rootLayout = await createLayout(path.join(layoutFolderPath))
  for await (const _layout of walkThroughAsync(rootLayout, layoutChildren)) continue
  return rootLayout
}

const nodesConstructorsMixin=Sup => class extends Sup {
  static get nodeConstructor(){
    return Node
  }
  static get linkerConstructor(){
    return Linker
  }
}
const Node = nodesConstructorsMixin(BasicNode)
const Linker = nodesConstructorsMixin(BasicLinker)

// Crea un listado de todos los archivos del directorio (incluyendo los subdirectorios de forma recursiva)
async function createListDirectory(folderPath, excludeDirs=[]){
  if (!Array.isArray(excludeDirs)) excludeDirs=[excludeDirs]
  const folderContentList = async (dirPath) => (await fs.stat(dirPath))?.isDirectory() && !(excludeDirs.includes(path.basename(dirPath))) ? ( await fs.readdir(dirPath)).map(file=>path.join(dirPath, file)) : [];
  const dirList = []
  for await (const dirPath of walkThroughAsync(folderPath, folderContentList, undefined, undefined, async pathName => ! (await fs.stat(pathName))?.isDirectory())) {
    dirList.push(dirPath)
  }
  return dirList
}
// con esta base se puede hacer el nivel superior que podría crear todo el arbol, basándose unicamente en la carpeta children para la recursión
// It creates 
const childrenFolderName = "children";
async function createLayout(layoutFolderPath) {
  const viewsFolderName = "views";
  const stylesFolderName = "css";

  async function createBranch(parentElement, folderPath, excludeDirs=[]) {
    (await createListDirectory(folderPath, excludeDirs))
      .forEach( childPath => parentElement.addChild(new Node({path: childPath})))
  }
  const layout = new Node({path: layoutFolderPath})
  const viewsBranch=new Linker();
  viewsBranch.props.name='views'
  await createBranch(viewsBranch, path.join(layoutFolderPath, viewsFolderName))
  layout.addRelationship(viewsBranch)
  const stylesBranch=new Linker();
  stylesBranch.props.name='styles'
  await createBranch(stylesBranch, path.join(layoutFolderPath, stylesFolderName))
  layout.addRelationship(stylesBranch)
  const childrenBranch=new Linker();
  childrenBranch.props.name='descendents'
  layout.addRelationship(childrenBranch)

  return layout
}

//header('Access-Control-Allow-Origin: *'); //To allow use of external