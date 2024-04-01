// --- dbmanager custom file ---

import {selectorFromAttr} from '../frontutils.mjs'
import {getTemplate} from './layouts.mjs'
import {setLogIcon} from "./webuser/login.mjs"
import {setCollectionButtons} from "./collections.mjs"

export async function bodyView(){
  const container = selectorFromAttr(await getTemplate("body"), "data-container")
  await setCollectionButtons(selectorFromAttr(container, "data-collections"))
  setLogIcon(selectorFromAttr(container, "data-log-icon-button"))
  return container
}
