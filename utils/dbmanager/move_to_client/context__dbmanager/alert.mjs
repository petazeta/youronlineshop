/**
  usage:
  - first time: customElements.define("alert-element", Alert)
  document.createElement("alert-element").showMsg("hola") // tp will be alertmsg
  document.createElement("alert-element").showAlert("tpName") // css class alert is designed for alert elements
*/
import {Alert as ProtoAlert} from '../alert.mjs'
import {getTemplate} from './layouts.mjs'
import prepareTpScripts from './viewcomponent.mjs'
import {selectorFromAttr} from '../frontutils.mjs'

class Alert extends ProtoAlert {
  async showMsg(msg, timeout=2000, closeOnClick=true, tp="alertmsg" /* string or DOM */) {
    tp = await getTp(tp)
    const valueElement = selectorFromAttr(tp, "data-value")
    if (valueElement) valueElement.textContent=msg
    return super.showAlert(tp, timeout, closeOnClick)
  }
  async showAlert(tp, params, timeout, closeOnClick) {
    tp = await getTp(tp)
    if (tp.querySelector("script"))
      tp = prepareTpScripts(tp, params)
    return super.showAlert(tp, timeout, closeOnClick)
  }
}

async function getTp(tp /* string or tp */) {
  if (typeof tp=="string") // tp is the tp name
    return await getTemplate(tp)
  if (tp.nodeType==1 && tp.tagName=="TEMPLATE")
    return tp.content
  return tp // tp is in DOM
}

// *** old just for not throwing errors in old stuff
export class AlertMessage{}
export {Alert}
