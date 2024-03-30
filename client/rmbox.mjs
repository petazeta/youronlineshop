import {selectorFromAttr} from "./frontutils.mjs"

export async function rmBoxView(getTemplate, bodyView, removeContainer) {
  if (typeof bodyView == "string")
    bodyView = await getTemplate(bodyView)
  const boxContainer = selectorFromAttr(await getTemplate("rmbox"), "data-container")
  selectorFromAttr(boxContainer, "data-rm-close-but").addEventListener('click', function (ev){
  	ev.preventDefault()
    if (removeContainer) {
      removeContainer.parentElement.removeChild(removeContainer)
    }
    else {
      boxContainer.parentElement.removeChild(boxContainer)
    }
  })
  selectorFromAttr(boxContainer, "data-rm-body").appendChild(bodyView)
  return boxContainer
}