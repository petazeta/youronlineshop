//import {getRoot as getSiteContent, setPageTitle} from "./sitecontent.mjs"
import {selectorFromAttr} from '../frontutils.mjs'
import {getTemplate} from './layouts.mjs'
//import {setOnClickNavToggle, initMenus, displayMenus} from "./pages/pages.mjs"
//import {setLangSelectionElm} from "./languages/langsview.mjs"
import {setLogIcon} from "./webuser/login.mjs"
//import {setCartIcon, cartBoxView} from "./shop/cart.mjs"
//import {initCategories, displayCategories} from "./catalog/categories.mjs"
import {setCollectionButtons} from "./collections.mjs"

export async function bodyView(){
  const bodyTp = await getTemplate("body")
  const body = selectorFromAttr(bodyTp, "data-body-container")
  await setCollectionButtons(selectorFromAttr(bodyTp, "data-collections"))




  //setOnClickNavToggle(selectorFromAttr(body, "data-navtoggle")) // showing up the page menus on pc screens
  //setLangSelectionElm(selectorFromAttr(body, "data-lang-select-container"))
  setLogIcon(selectorFromAttr(body, "data-log-icon-button"))
  //setCartIcon(selectorFromAttr(body, "data-cart-icon-button"), selectorFromAttr(body, "data-cartbox"))
  //selectorFromAttr(body, "data-cartbox").appendChild(await cartBoxView(selectorFromAttr(body, "data-cartbox")))
  //getSiteContent().getNextChild("page_head_subtitle").setContentView(selectorFromAttr(body, "data-site-subtitle"), false)
  //await initMenus(selectorFromAttr(body, "data-centralcontent"))
  //await displayMenus(selectorFromAttr(body, "data-menus"))
  //getSiteContent().getNextChild("ctgbxtt").setContentView(selectorFromAttr(body, "data-ctgtitle"), false)
  //await initCategories(selectorFromAttr(body, "data-centralcontent"))
  //await displayCategories(selectorFromAttr(body, "data-cats-container"))
  //getSiteContent().getNextChild("bottom").getNextChild("designed").write(selectorFromAttr(body, "data-designed"))

  
  return bodyTp
}
