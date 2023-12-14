import {prepareRequest, prepareMultiRequest} from "./request.mjs"

export async function exportData(langs, treeRoots) {
  if (!Array.isArray(treeRoots))
    treeRoots = [treeRoots]
  let trees = []
  for (const treeRoot of treeRoots) {
    let [tree] = await prepareRequest(await cloneTreeData(treeRoot), "add my tree")
    trees.push(tree)
  }
  const [langsExp] = await prepareMultiRequest("add my tree", langs)
  if (trees.length == 1)
    trees = trees[0]
  return {"languages": langsExp, "tree": trees}
}

async function cloneTreeData(treeRoot) {
  return treeRoot.clone(null, 0).loadRequest("get my tree")
}