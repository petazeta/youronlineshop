import {selectorFromAttr} from "./frontutils.mjs"
import {zip} from "../shared/utils.mjs"

// It prints the node data using the given template
// Args -> myNodes: node with user data, fieldTemplate (it comes usually from "singlefield" or "singleinput"), myLabels: labelNode, "propName", null
// myNodes, myLabels could be an array. If so its elements should be correlated
export async function dataView(fieldTemplate, myNodes, myContainer, myLabels, excludePropsArray){
  // It adds the fields for a user data container
  if (!Array.isArray(myNodes))
    myNodes = [myNodes]
  if (!Array.isArray(myLabels))
    myLabels = new Array(myNodes.length).fill(myLabels)
  if (!Array.isArray(excludePropsArray))
    excludePropsArray = new Array(myNodes.length).fill(excludePropsArray)
  for (const [myNode, myLabel, excludeProps] of zip(myNodes, myLabels, excludePropsArray)) {
    for (const propKey of myNode.getParent().childTableKeys) {
      if (excludeProps) {
        if (!Array.isArray(excludeProps))
          excludeProps = [excludeProps]
        if (excludeProps.includes(propKey))
          continue
      }
      let myFieldContainer = fieldTemplate.cloneNode(true).querySelector("[data-container]")
      let myLabelElm = selectorFromAttr(myFieldContainer, "data-label")
      if (myLabel && typeof myLabel == "object")
        await myLabel.getNextChild(propKey)?.setContentView(myLabelElm)
      else if (myLabel=="propName")
        selectorFromAttr(myLabelElm, "data-value").textContent = propKey
      if (myLabel)
        selectorFromAttr(myLabelElm, "data-value").attributes.for.value = propKey
      myNode.writeProp(selectorFromAttr(myFieldContainer, "data-text"), propKey)
      myContainer.appendChild(myFieldContainer)
    }
  }
}