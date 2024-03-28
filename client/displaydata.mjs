import {visibleOnMouseOver, selectorFromAttr} from "./frontutils.mjs"
import {zip} from "../shared/utils.mjs"

// It prints the node data using the given template
// Args -> myNodes: node with user data, fieldTemplate (it comes usually from "singlefield" or "singleinput"), myLabels: labelNode, "propName", null
// myNodes, myLabels could be an array. If so its elements should be correlated
export async function dataView(fieldTemplate, myNodes, myContainer, myLabels, excludePropsArray, setEdition){
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
      let myFieldContainer = selectorFromAttr(fieldTemplate.cloneNode(true), "data-container")
      let myLabelElm = selectorFromAttr(myFieldContainer, "data-label")
      if (myLabel && typeof myLabel == "object")
        await myLabel.getNextChild(propKey)?.setContentView(myLabelElm)
      else if (myLabel=="propName")
        selectorFromAttr(myLabelElm, "data-value").textContent = propKey
      if (myLabel)
        selectorFromAttr(myLabelElm, "data-value").attributes.for.value = propKey
      const textField = selectorFromAttr(myFieldContainer, "data-text")
      const textContainer = selectorFromAttr(textField, "data-value") || textField
      myNode.writeProp(textContainer, propKey)
      textContainer.setAttribute("title", propKey) // It shows the label on hover
      if (setEdition) {
        visibleOnMouseOver(selectorFromAttr(textField, "data-butedit"), textField) // on mouse over edition button visibility
        await setEdition(myNode, textField, propKey)
      }
      myContainer.appendChild(myFieldContainer)
    }
  }
}