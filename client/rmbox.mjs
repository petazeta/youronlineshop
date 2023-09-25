import {selectorFromAttr} from "./frontutils.mjs"

export async function rmBoxView(getTemplate, bodyTp, removeContainer) {
	const rmBoxTp = await getTemplate("rmbox")
  const boxContainer = selectorFromAttr(rmBoxTp, "data-container")
  selectorFromAttr(boxContainer, "data-rm-close-but").addEventListener('click', function (ev){
  	ev.preventDefault()
    if (removeContainer) {
      removeContainer.parentElement.removeChild(removeContainer)
    }
    else {
      boxContainer.parentElement.removeChild(boxContainer)
    }
    //siteContentNode.dispatchEvent("closewindow")
  })
  selectorFromAttr(boxContainer, "data-rm-body").appendChild(bodyTp)
  return rmBoxTp
}