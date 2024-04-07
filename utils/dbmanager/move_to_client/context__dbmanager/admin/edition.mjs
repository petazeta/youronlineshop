import {startEdition} from '../../admin/edition.mjs'
import {selectorFromAttr} from '../../frontutils.mjs'
import {getTemplate} from '../layouts.mjs'

/* This method is for enabling edition capabilities in an edit button layout. It gets the edit button layout (template) name and a common container of the element to be edited and the edit button. The opeartion result would be the insertion of an edition button (It desn't remove the previous button container content) with edition funcionalities in the correspondent container element at the common container. If the editElement style display is settled to "none" then it will become "unset" to visualize it (except if it is marked as data-toggle).
   - Button layout will have these labeled elements:
     - data-edit-button: the efecive button element of the layout.
     - Other optional elements can be present and targeted.
   - Common container element elmView will have these labeled elements:
     - data-value (or "data-" plus the dataIdValue argument value): The element that contains the text to be edited.
     - data-butedit: the future container of the edition button
     - data-edit-buts: Optional. An element that will be hidden when edition starts. It is usually the edition button (or buttons) container so the edition button is not visible when activated.
     - data-toggle: At the editElement, it changes edition to visible when click edition button and to hiiden after edition. It is handful for the code edition textarea.
     - data-has-target: Optional for code edition, to set the efective edition element, see startEdition function
     - data-container: optional to mark the global container
   - There is another layout for the edition button: editTp. This layout will have the edition button marked as data-edit-button

  Some parameters meaning:
  - elmView: the layout element or a layout element container. It will usually serve as well as the container for switching visibility when onhover for the edition button. If not there is the optional mark "edit-element-container".
  - image: when its value is "code" then the edition will start in HTML code edition mode.
  - inlineEdition: not new lines allowed, dataProcessor: commited data preprocessor

  Note for upper methods:
    if (!checkAdmin() && false) return
    const editTpName = image=="code" ? "buteditcode" : "butedit"
*/
export async function setEdition(langDataNode, elmView, editProp, editAttribute="textContent", inlineEdition=true, dataIdValue="value", dataIdButContainer="butedit", dataProcessor, editButtonTpName="butedit"){
  const editElement = selectorFromAttr(elmView, "data-" + dataIdValue)
  // Making editAttribute default value as "value" for input elements
  if (editElement.tagName=="INPUT" && editAttribute=="textContent")
    editAttribute = "value"
  const butEditContainer = selectorFromAttr(elmView, "data-" + dataIdButContainer)
  const butsEditContainer = selectorFromAttr(elmView, "data-edit-buts") || butEditContainer

  const btEditTp = await getTemplate(editButtonTpName)
  const buttonElement = btEditTp.querySelector("[data-edit-button]")

  buttonElement.addEventListener('click', (event) =>
    startEdition(langDataNode, editElement, butsEditContainer, editProp, editAttribute, inlineEdition, dataProcessor, elmView)
  )
  // this is to set element to visible for edition purpouse. Edtion element sometimes is hidden, usually when it is a not displayed element (for example some alert msg) that is turn out to be displayed as an input for edition purpouses
  if (!editElement.hasAttribute("data-toggle") && editElement.style.display=="none")
    editElement.style.display="unset"
  //butEditContainer.innerHTML="" // ??????? es realmente necesario?
  butEditContainer.appendChild(btEditTp)
}