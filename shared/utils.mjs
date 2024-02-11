/*
  Some utils functions for nodes.
  The most important is the one to serialize a node tree (in node list format) from a root node. And to undo this action.
  Data strongnest is gained with this format over the json because data has no hearchy, this is, each data cell is in equal level, so if some data is lost we could easily restore the rest of the data and it becomes more clear for reading. It is a similar principle than new line delimited json so if the data is corrupt we can recover data easily with this format.

  It could be also used in no sql solution or to fastern the sql by quering all elements at once
  
  En lugar de poner un id numérico, sería mejor que el id (en adelante hash) fuera tipo (table_name:id): TABLE_ITEMCATEGORIES:5. Y para las female quizá: (partner_id:childTableName;parentTableName)
  de esta forma sería más significativo. La función que sacaría el hash a partir del nodo se llama función de hash.
  
  Quizás sería más legible el resultado de packing si utilizaramos un objecto en lugar de un array, mediante Object.fromEntries(mapelement), en lugar de Array.from(mapElement), la operación inversa sería Object.entries(objelement);
*/


import {BasicNode} from './linker.mjs';

// serializing the node data
export function deconstruct(inputNode, cutVoidRels=false){
  let rootNode = BasicNode.getRoot(inputNode)
  if (!rootNode)
    rootNode = indexNode

  const getTreeNodes = (thisNode) => walkThrough(
    thisNode,
    (elmSplit)=>{
      // set extra Parents
      if (isLinker(elmSplit))
        return elmSplit.children
      if (cutVoidRels)
        return elmSplit.relationships.filter(rel=>rel.children.length)
      return elmSplit.relationships
    },
    undefined,
    (elmYield)=>{
      if (isLinker(elmYield) && true) {
        const extraParentNodes = []
        for (const child of elmYield.children) {
          if (Array.isArray(child.parent)) {
            child.parent.slice(1).forEach(extraParent=>{
              extraParentNodes.push(extraParent.partner, extraParent)
            })
          }
        }
        return [...extraParentNodes, elmYield]
      }
      return [elmYield]
    }
  )

  const serialNodes = Array.from(getTreeNodes(rootNode)).reduce((acc,val)=>acc.concat(...val), []) // yields comes in arrays

  const serials = new Map(serialNodes.map((val, ind)=>{
    const newOne = clearNode(val)
    if (!isLinker(val) && Array.isArray(val.parent)) {
      newOne._parent = val.parent.map(parent=>serialNodes.findIndex(parentVal=>parentVal == parent) + 1)
    }
    else if (val._parent) {
      newOne._parent = serialNodes.findIndex(parentVal=>parentVal == val._parent) + 1
    }
    return [ind + 1, newOne]
  }))
  const indexKey = serialNodes.findIndex(val=>val==inputNode)
  if (indexKey==-1) {
    throw new Error("incorrect deconstruct")
  }
  // ponemos un último valor en el map para establecer el valor inicial del bloque: index: id, 
  serials.set('index', indexKey + 1)

  return serials

  // helpers
  // It returns the node with the basic data. It clears the links to parent and children.
  function clearNode(myNode) {
    const serialCommon ={_parent: null, _children:[]},
    serialLinker = {partner: null, children:[]},
    serialNode = {parent: null, relationships:[]},
    commonKeys = ['props'],
    nodeKeys = [],
    linkerKeys = ['childTableKeys', 'childTableKeysInfo', 'sysChildTableKeys', 'sysChildTableKeysInfo']
    const myKeys = isLinker(myNode) ? [...commonKeys, ...linkerKeys] : [...commonKeys, ...nodeKeys];
    const serialResult = isLinker(myNode) ? {...serialCommon, ...serialLinker} : {...serialCommon, ...serialNode};
    for (const key of myKeys) {
      serialResult[key] = myNode[key]
    }
    return serialResult
  }
  function isLinker(myNode) {
    return BasicNode.detectLinker(myNode)
  }
}

export function construct(serials){
  const tree = new Map() // we return a copy not to modify the original
  serials.forEach((dataValue, id)=>{
    if (id=='index')
      return
    const value = JSON.parse(JSON.stringify(dataValue)) // make a copy
    tree.set(id, value)
    // set the antecesor
    if (Array.isArray(value._parent)) {
      value._parent = value._parent.map(parentId=>parentId && tree.get(parentId))
      value.parent = value._parent
      value.parent.forEach(parent=>parent.children.push(value))
    }
    else {
      setLinks(value)
    }
    function setLinks(value) {
      const parent = value._parent && tree.get(value._parent)
      if (!parent)
        return
      // add child to parent
      value._parent = parent
      if ("parent" in value)
        value.parent = parent
      else value.partner = parent
      parent._children.push(value)
      if ("children" in parent)
        parent.children.push(value)
      else parent.relationships.push(value)
    }
  })
  return tree.get(serials.get('index')) // devuelve el nodo adecuado, no el primero
}

export const unpacking = data=>{
  if (typeof data == 'object')
    return construct(new Map(data))
  return data
}
export const arrayUnpacking=datas=>{
  if (typeof datas == 'object') return datas.map(data => unpacking(data));
  return datas;
};
export const packing = (data, cutVoidRels=false)=>{
  if (typeof data == 'object')
    return Array.from(deconstruct(data, cutVoidRels))
  return data
}
export const arrayPacking=datas=>{
  if (typeof datas == 'object') return datas.map(data => packing(data));
  return datas;
};

export const splitLinesFormat = jsonData=>{
  return jsonData.replaceAll('],[', '],\n[')
}

export const exportFormat = jsonData=>{
  return splitLinesFormat(jsonData).replaceAll('[[[', '\n[[[').replaceAll(']]],', ']]],\n')
}
// DEPRECATED -> replaceLangData
export function replaceData(target, source, relName, relDataName) {
  // myElement => [sourceChildren, targetChildren]
  const transformation = (myElement, previousElement) => {
    const sourceDataRel=myElement[0].map(sourceChild=>sourceChild.getParent()).find(sourceChildParent=>sourceChildParent.props.name==relDataName)
    if (sourceDataRel?.getChild()) {
      const targetDataRel=myElement[1].map(targetChild=>targetChild.getParent()).find(targetChildParent=>targetChildParent.props.name==relDataName)
      if (targetDataRel) {
        targetDataRel.children=[];
        targetDataRel.addChild(sourceDataRel.getChild());
      }
    }
  }
  // return [sourceChildren, targetChildren]
  const splitting=(myElement, resultElement)=>[ myElement[0].getRelationship(relName)?.children || [], myElement[1].getRelationship(relName)?.children || [] ]

  for (const _iteration of walkThrough([source, target], splitting, transformation)) continue;
  return target
}

export function replaceLangData(target, source, langCollectionName) {
  const isDataBranch=myParent=>myParent.sysChildTableKeysInfo?.some(syskey=>syskey.type=='foreignkey' && syskey.parentTableName==langCollectionName)
  // myElement => [sourceChildren, targetChildren]
  const transformation = (myElement, previousElement) => {
    const sourceDataRel=myElement[0].map(sourceChild=>sourceChild.getParent()).find(isDataBranch)
    if (sourceDataRel?.getChild()) {
      const targetDataRel=myElement[1].map(targetChild=>targetChild.getParent()).find(isDataBranch)
      if (targetDataRel) {
        targetDataRel.children=[]
        targetDataRel.addChild(sourceDataRel.getChild())
      }
    }
  }
  // *** relName is not defined?
  // return [sourceChildren, targetChildren]
  const splitting=(myElement, resultElement)=>[ myElement[0].getRelationship(relName)?.children || [], myElement[1].getRelationship(relName)?.children || [] ]

  for (const _iteration of walkThrough([source, target], splitting, transformation)) continue;
  return target
}

export function getLangDataBranches(treeRoot, langCollectionName) {
  const isDataBranch = branch=>branch.isYBranch(langCollectionName)
  //const isDataBranch = branch=>true
  const getBranches = myElm => myElm.children.reduce((total, child)=>[...total, ...child.relationships], [])
  return Array.from(walkThrough(treeRoot.parent, getBranches, undefined, undefined, isDataBranch))//.reduce((total, rel)=> [...total, ...rel.children], [])
}

// It loads source into target. It doesn't remove original content but fills it.
// It doesn't go up the tree
export async function crawler(target, source) {
  if (target.constructor.detectLinker(source) != target.constructor.detectLinker(target))
    throw new Error("target and source are linker versus node")
  if (!target.constructor.detectLinker(source))
    target.constructor.copyProps(target, source)
  else
    target.loadChildTableKeys(source)
  source._children.forEach(res=>innerCrawler(target, res))
  function innerCrawler(targetParent, source) {
    for (const _iteration of walkThrough([targetParent, source], splitting)) continue
    function splitting([elmTargetParent, elmSource]) {
      if (targetParent.constructor.detectLinker(elmSource)) {
        let targetLinker
        const linkerMatch = elmTargetParent.relationships.find(targetLinker=>targetLinker.props.name==elmSource.props.name)
        if (linkerMatch) {
          targetLinker = linkerMatch
          targetParent.constructor.copyProps(targetLinker, elmSource)
          targetLinker.loadChildTableKeys(elmSource)
        }
        else {
          targetLinker = elmTargetParent.addRelationship(new targetParent.constructor.linkerConstructor(elmSource.props))
          targetLinker.loadChildTableKeys(elmSource)
        }
        return elmSource.children.map(child=>[targetLinker, child])
      }
      else {
        let targetNode, nodeMatch
        if (elmTargetParent.children.length > 0) {
          nodeMatch = elmTargetParent.children.find((targetNode, pos)=>pos===elmSource.parent.children.indexOf(elmSource))
        }
        if (nodeMatch) {
          targetNode = nodeMatch
          targetParent.constructor.copyProps(targetNode, elmSource)
        }
        else {
          targetNode = elmTargetParent.addChild(new targetParent.constructor.nodeConstructor(elmSource.props))
        }
        return elmSource.relationships.map(rel=>[targetNode, rel])
      }
    }
    return targetParent
  }
}

//let findChildBranch = (myNode, childCollName) => myNode.relationships.find(langRel=>langRel.props.childTableName==childCollName)
/*
async function setLangs(treeRoot) {
  const {getLangDataBranches} = await import("./shared/utils.mjs")
  const {getLanguagesRoot} = await import("./client/context__main/languages/languages.mjs")
  for (const langDataBranch of getLangDataBranches(treeRoot, getLanguagesRoot().parent.props.childTableName)) {
    for (const langData of langDataBranch.children) {
      // clone langdata
      let dataClon = langData.clone(null, 0)
      // add new parent (langDataBranch.props.childTableName, getLanguagesRoot().parent.props.childTableName)
      dataClon.parent = new langDataBranch.constructor.linkerConstructor(langDataBranch.props.childTableName, getLanguagesRoot().parent.props.childTableName)
      dataClon.parent.addChild(dataClon)
      // loadtreeup langData
      await dataClon.parent.loadRequest("get my tree up") 
      // add lang link
      //dataClon.request("add my link")
      console.log(dataClon)
    }
    //console.log(findChildBranch(lang, langBranchData.props.childTableName))
  }
}

const {getRoot} = await import ("./client/context__main/sitecontent.mjs")

await setLangs(getRoot())
*/

export async function reloadLangData(target, getDataBranch){ //ESTA MAL REVISAR
  // Node no esta definido
  const subCatData=target.getMainBranch().children.reduce((acc, rootChild)=>[...acc, ...rootChild.getMainBranch().children.map(child=>getDataBranch(child))], []);
  const langParent=this.getCurrentLanguage().getRelationship({childTableName: getDataBranch(this.treeRoot).childTableName});
  const result = await Node.requestMulti("get my children", subCatData, {extraParents: langParent});
  result.forEach((value, key)=>subCatData[key].addChild(new Node().load(value.data[0])))
}

export function getMainBranchDataNodes(startNode, justThisLevel=-1, maxDepth){
  return Array.from(walkThrough(startNode, (myElement)=>myElement.getMainBranch().children, undefined, undefined,
    (resultElement, resultParent, currentDepth)=>{
      if (justThisLevel==-1 || currentDepth==justThisLevel) return true;
    }, undefined, maxDepth))
}
/*
// Only when structure is identical should be refactored to be similar to replaceData
export function replaceLangData(targetTree, sourceTree){
  const sourceArray=sourceTree.arrayFromTree();
  targetTree.arrayFromTree().forEach((targetTree, i)=>{
    if (BasicNode.detectLinker(targetTree)) {
      const isLangContent = targetTree.sysChildTableKeysInfo?.some(syskey=>syskey.type=='foreignkey' && syskey.parentTableName=="TABLE_LANGUAGES");
      //Swap the other langs content
      if (isLangContent) targetTree.children[0].props=sourceArray[i].children[0].props;
    }
  });
  return targetTree;
}
*/

// split the languages data in one array of langdata for each language - Maybe should be revised
// En lugar de copiar todo el tree original podriamos hacerlo mejor haciendo una función específica par el walkthrough en lugar de usar arrayFromTree
// esta funcion haría la seleccion del lenguaje, sería más directo que copiar todo el lenguaje separandolo en nodos y luego quitar de los nodos
// linker que coincidan y todo eso
// directamente se haria todo con el walkthrough de una vez
export function splitLangTree(origTree, totalLang){
  if (totalLang<2)
    return [origTree]
  const origSerial = arrayFromTree(origTree)
  const singleTrees = new Array(totalLang).fill().map(()=>origTree.clone()) // Array(N) alone doesn't work, that's why we need to call fill()
  singleTrees.forEach((singleTree, lang_i)=>{
    const langSerial = arrayFromTree(singleTree)
    origSerial.forEach((orig, i)=>{
      if (BasicNode.detectLinker(orig)) {
        const isLangContent = orig.sysChildTableKeysInfo && orig.sysChildTableKeysInfo.some(syskey=>syskey.type=='foreignkey' && syskey.parentTableName=="TABLE_LANGUAGES");
        //The children are the lang conent
        if (isLangContent) langSerial[i].children=[orig.children[lang_i]];
      }
    })
  })
  return singleTrees
}

export function getChildrenArray(myNode) {
  // const relChildrenArray = (rel) => rel.children.reduce((childArray, child)=>[...childArray, child], []);
  const relChildrenArray = (rel) => [...rel.children];
  if (BasicNode.detectLinker(myNode)) return relChildrenArray(myNode);
  return myNode.relationships.reduce((totalArray, rel)=>[...totalArray, ...relChildrenArray(rel)], []);
}

export function arrayFromTree(thisNode){
  return Array.from(walkThrough(thisNode))
}


// equivalent to python zip. Asociates elements from a row to another row/rows
export function zip(...args){
  return Array.from(zip_iter(args))
  
  function* zip_iter (iterables){
    let iterators = iterables.map(i => i[Symbol.iterator]() )
    while (true) {
      let results = iterators.map(iter => iter.next() )
      if (results.some(res => res.done) ) return
      else yield results.map(res => res.value )
    }
  }
}

// ** Large used **
// Transformation is to produce a diferent resulting element that is to be yield: resultElement,
// but we can also use it for changing the actual element, in this case result
// would be the own element. The same (resultElement = myElement) when no transformation applyed.
// We keep track of the parent, the result element, the current iteration deep, etc...
// to use them as parameters for the next iteration execution functions.
// The yielding result can differ however from resultElement so there are others transformation posibilities
// at the output and It can also be filtered.

export function* walkThrough(startElement
  , splitting=(myElement, resultElement, currentDepth)=>myElement._children
  , transformation=(myElement, resultParent, currentDepth)=>myElement // last resultElement
  , toYield=(resultElement, resultParent, currentDepth)=>resultElement
  , filterYield=(resultElement, resultParent, currentDepth)=>true
  , startParent=null
  , maxDepth=-1){
  function* innerLoop(resultElement, myElement, resultParent, myParent, currentDepth) {
    if (filterYield(resultElement, resultParent, currentDepth)) yield toYield(resultElement, resultParent, currentDepth)
    if (maxDepth-currentDepth==0) return;
    for (const child of splitting(myElement, resultElement, currentDepth)) {
      yield* innerLoop(transformation(child, resultElement, currentDepth), child, resultElement, myElement, currentDepth+1)
    }
  }
  yield* innerLoop(transformation(startElement, startParent, 0), startElement, startParent, startParent, 0)
}
// estoy transformandolo a async pero aun no va
export async function* walkThroughAsync(startElement
  , splitting = async (myElement, resultElement, currentDepth)=>myElement._children
  , transformation = (myElement, resultParent, currentDepth)=>myElement // last resultElement
  , toYield = (resultElement, resultParent, currentDepth)=>resultElement
  , filterYield = (resultElement, resultParent, currentDepth)=>true
  , startParent = null
  , maxDepth=-1){
  async function* innerLoop(resultElement, myElement, resultParent, myParent, currentDepth) {
    if (await filterYield(resultElement, resultParent, currentDepth))
      yield await toYield(resultElement, resultParent, currentDepth)
    if (maxDepth-currentDepth==0)
      return
    for (const child of await splitting(myElement, resultElement, currentDepth)) {
      yield* await innerLoop(transformation(child, resultElement, currentDepth), child, resultElement, myElement, currentDepth+1)
    }
  }
  yield* await innerLoop(transformation(startElement, startParent, 0), startElement, startParent, startParent, 0)
}