Iterables
=========

## Iterable way for recursive accessing children

For this design we got to access the element nodes in a tree.
- splitting: Function to return the element children
- transformation: Function for node transformation during the step process

`function* iterElement (myElement, maxDepth=-1, parentElement=null, splitting=(myElement, resultElement=null)=>myElement._children, transformation=(parentElement, myElement)=>myElement){
  let resultElement=transformation(parentElement, myElement)
  yield [resultElement, parentElement]
  if (maxDepth==0) return;
  maxDepth--;
  for (const elementChild of splitting(myElement, resultElement)) {
    yield* iterElement(elementChild, maxDepth, resultElement, splitting, transformation)
  }
}`

### Loading elements in lisks object

With the function above and this transformation we could load a node tree in node-link format

`const toLinkObject=(parentElement, myElement)=>{
  let linkElement=new LinkNode({data: myElement})
  if (parentElement) parentElement.addDescendent(linkElement)
  return linkElement
}
let rootElement={data: "root", _children: [{data: "child1", _children:[{data: "child1 1", _children: []}]}, {data: "child2", _children:[{data: "child2 1", _children: []}, {data: "child2 2", _children: []}]}]}
let rootLink=Array.from(iterElement(rootElement, -1, null, myElement=>myElement._children, toLinkObject)).shift()[0]`


### Looking deeper

We must take in account that meanwhile the splitting function is being applyed to the original element, the transformation function takes as parameter the original element and the transformed parent. This way we could add the children to the actual result parent. This characteristics are even more visible in another approach for the iterator that is non recursive.

`function* walkThrough (startElement, maxDepth=-1, startParent=null, splitting=(myElement, resultElement)=>myElement._children, transformation=(myElement, parentElement)=>myElement, toYield=(resultElement, resultParent)=>resultElement, filterYield=(resultElement, resultParent)=>true){
  let stack=[[transformation(startElement, startParent), startElement, startParent, startParent, maxDepth]]
  while (stack.length) {
    let [resultElement, myElement, resultParent, myParent, maxDepth]=stack.shift();
    if (filterYield(resultElement, resultParent)) yield toYield(resultElement, resultParent)
    if (maxDepth==0) continue;
    stack=[...stack, ...splitting(myElement, resultElement).map(child=>[transformation(child, resultElement), child, resultElement, myElement, maxDepth-1])]
  }
}`

This approach could be more clear and more explicit.

The iteration route for the two approachs are not equivalent. The none recursive approach walks in levels. It doesn't walk through the next level untill all node levels are complete. Te recursive approach nevertheless is walking through branches, starting one branch and not walking through the next until the branch is complete. Both routes doesn't jump any node, in the way that at any time if a node is processed every parents nodes are being already processed. This is important for the packing-unpacking algoritm that requires that parents appear before their children.

### Reading file system tree

In this case we want to get link-node version of the file system folder tree. The situation now is that we are using parent data for resolving the new node and for getting the children.

`const readFolderDirectory=(dirPath)=>statSync(dirPath)?.isDirectory() ? readdirSync(dirPath) : [];
const toLinkObject=(parentElement, myElement)=>{
  let linkElement=new LinkNode({data: myElement})
  if (parentElement) {
    if (parentElement.props.data) linkElement.props.data=path.join(parentElement.props.data, linkElement.props.data)
    parentElement.addDescendent(linkElement)
  }
  return linkElement
}
const readFolderDirectoryFullPath=(dirPath, resultElement)=>{
  let fullPath=dirPath;
  if (resultElement?.props.data) fullPath=resultElement.props.data
  return readFolderDirectory(fullPath);
}
const iteratorLink=walkThrough('.', -1, null, readFolderDirectoryFullPath, toLinkObject)
const rootLink=iteratorLink.next().value[0]
for (const i of iteratorLink) continue`


### Transforming to linker-node tree

A links-node tree is like a linker with just one relationship. To make the transformation we have to add the relationship between parent and child.

This would be the transformation to make the linker-node tree.

`const toLinkerObject=(parentElement, myElement)=>{
  let dataElement=new BasicNode({data: myElement})
  if (parentElement) {
    if (parentElement.props.data) dataElement.props.data=path.join(parentElement.props.data, dataElement.props.data)
    if (!parentElement.relationships.length)
      parentElement.addRelationship(new BasicLinker("descendents"))
    parentElement.getRelationship().addChild(dataElement)
  }
  return dataElement
}`

We could also make this step based in the past transformation by iterating it.

#### Consuming iterator while transforming result

`function fromLinkIterTolinkerTree (iterElement){
  let elementIterator=iterElement.next()
  let [linkRoot, _] = elementIterator.value
  let myRoot;
  if (linkRoot) myRoot=new BasicNode(linkRoot.props)
  if (elementIterator.done) return myRoot;
  elementIterator=iterElement.next()
  const listElements=[[linkRoot, myRoot]]
  while(!elementIterator.done){
    let [myElement, parentElement] = elementIterator.value
    let dataElement=new BasicNode(myElement.props)
    listElements.push([myElement, dataElement])
    let parentDataElement=listElements.find(el=>el[0]==parentElement)
    if (parentDataElement) parentDataElement = parentDataElement[1]
    if (parentDataElement) {
      if (!parentDataElement.relationships.length)
        parentDataElement.addRelationship(new BasicLinker("descendents"))
      parentDataElement.getRelationship().addChild(dataElement)
    }
    elementIterator=iterElement.next()
  }
  return myRoot
}
let myLinkIter=walkThrough('.', -1, null, readFolderDirectoryFullPath, toLinkObject)
console.log(fromLinkIterTolinkerTree(myLinkIter))`

Revisar como quedaría arrayFromTree con esto, hecho en temp/tree/test.mjs

## Uso de async-iterators para generar un eventfeed

Se podrían lanzar eventos a un stream y creacion de escuchas de eventos mediante algo como streaming o feed. Por ejemplo habría algo así como el emisor de eventos (streamwrite) y el detector (streamread), el detector tendría que cerrar la conexión. Open conexión: creación de feed, close conexion: feed stop, emisión: dispachMessage. Esto podría substituir las notificaciones con el patron observable.

Para realizar la conversión a sync-iterator a partir de un evento, se podría hacer mediante una promesa. Se crea una promesa la cual va a ser resuleta cuando se produzca el evento. Mediante funciton generator se crea un bucle que espera la promesa (creada cada vez) iterando cada resultado.

Mas info en: https://seg.phault.net/blog/2018/03/async-iterators-cancellation/

## Delegación de iterables

La expresión "yield* iterable" puede delegar la iteración entre iterables.

--------------------------

```
// no recursive version, converting a recursive to non recursive
export function* walkThrough2(startElement
  , splitting=(myElement, resultElement, currentDepth)=>myElement._children
  , transformation=(myElement, previousElement, currentDepth)=>myElement
  , toYield=(resultElement, resultParent, currentDepth)=>resultElement
  , filterYield=(resultElement, resultParent, currentDepth)=>true
  , startParent=null
  , maxDepth=-1){
  let stack=[[transformation(startElement, startParent, 0), startElement, startParent, startParent, 0]]
  while (stack.length) {
    let [resultElement, myElement, resultParent, myParent, currentDepth]=stack.shift();
    if (filterYield(resultElement, resultParent, currentDepth)) yield toYield(resultElement, resultParent, currentDepth)
    if (maxDepth-currentDepth==0) continue;
    stack=[...stack,
      ...splitting(myElement, resultElement, currentDepth)
      .map(child=>
        [transformation(child, resultElement, currentDepth), child, resultElement, myElement, currentDepth+1])]
  }
}
```
---------------------

https://www.youtube.com/watch?v=1dUpHL5Yg8E
https://qwtel.com/posts/software/async-generators-in-the-wild/
https://blog.sessionstack.com/how-javascript-works-iterators-tips-on-gaining-advanced-control-over-generators-41dc3eb3bc20
https://www.youtube.com/watch?v=tmeKsb2Fras
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators