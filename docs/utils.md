Utils
=====

## Introduction

There are some general purpouse tools that need special mention for being quite complex and principal. General purpose tools are implemented at shared/utils.mjs

## Walk trough

This tool is made to perform recursive operations relationated mainly with walk into a tree structure. The node class perform its recursive operations through its own methods of its structure but sometimes we need to perform some recursive operations not implemented for the class structure and for those situations this tool is useful.

The information of this tool is at [iterables.md](iterables.md)

### Derivados

Se puede formar estas funciones:
`// Determina el strato de un nodo
function getNodeLevel(myNode){
  let myRoot=myNode.getRoot()
  if (myRoot.detectLinker()) myRoot=myRoot.getChild()
  const splitting=myElement=>myElement.getMainBranch()?.children || []
  const filterYield=myElement=>myElement===myNode
  const toYield=(resultElement, resultParent, currentDepth)=>currentDepth
  return walkThrough(myRoot, splitting, undefined, toYield, filterYield).next()?.value


## Sorting children

This is not in utilities, just follow this procedure to do it.

`const skey=myParent.getSysKey("sort_order")
// short modifies the original
myParent.children.sort((a,b)=>a.props[skey]-b.props[skey])`