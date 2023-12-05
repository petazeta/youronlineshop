// import {Alert} from '../alert.mjs' // this is yet loaded at main.mjs
import {getRoot as getSiteText} from '../sitecontent.mjs'
import {getTemplate} from '../layouts.mjs'
import {getLanguages, setCurrentLanguage, getCurrentLanguage} from './languages.mjs'
import {selectorFromAttr} from '../../frontutils.mjs'

export async function setLangSelectionElm(viewElement){
  const selectElm=selectorFromAttr(viewElement, "data-value")
  for (const lang of getLanguages()) {
    const langTp = await getTemplate("langopt")
    selectorFromAttr(langTp, "data-value").textContent=lang.props.code
    selectElm.appendChild(langTp)
  }
  selectElm.selectedIndex=getLanguages().indexOf(getCurrentLanguage())
  selectElm.onchange=async function(){
    setCurrentLanguage(getLanguages()[selectElm.selectedIndex])
    document.createElement("alert-element").showMsg(getSiteText().getNextChild("langbox").getNextChild("changelangwait").getLangData(), 3000)
  }
}