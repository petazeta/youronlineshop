/* Falta implementarlo en forma asincrona */

import {BasicLinker, BasicNode} from '../shared/linker.mjs';
import {walkThrough, walkThroughAsync} from '../shared/utils.mjs';
import {promises as fs} from 'fs';
import * as path from 'path';

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

export async function readTree(layoutFolderPath) {
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