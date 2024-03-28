import {selectorFromAttr} from "../../frontutils.mjs"
import {getTemplate} from "../layouts.mjs"
import {Node} from '../nodes.mjs'
import {startView} from '../start.mjs'
import {chagePwdsView} from "./changepwds.mjs"

export async function dbPopView() {
  const mainTp = await getTemplate("dbpop")
  const container = selectorFromAttr(mainTp, "data-container")
  selectorFromAttr(container, "data-button").addEventListener("click", async()=>{
    document.createElement("alert-element").showAlert(selectorFromAttr(mainTp, "data-alert"))
    if (!await Node.makeRequest("populate database"))
      return document.createElement("alert-element").showMsg("Error populating database")
    await startView(chagePwdsView)
    document.createElement("alert-element").showAlert(selectorFromAttr(mainTp, "data-success-msg"))
  })
  return container
}

  /*

        thisElement.addEventListener("click", async ()=>{
          const {AlertMessage}=await import('./' + CLIENT_MODULES_PATH + 'alert.mjs');
          thisNode.setView(document.body, thisElement.previousElementSibling);

          if (!(await thisNode.constructor.makeRequest("populate database"))) return new AlertMessage("Error populating database").showAlert();
          
          //Load languages and select my language
          const {selectMyLanguage} = await import('./' + CLIENT_MODULES_PATH + 'languages.mjs');
          if (! await selectMyLanguage()) throw new Error('No Language Content');
          
          //Load web site text content
          const {loadText} = await import('./' + CLIENT_MODULES_PATH + 'sitecontent.mjs');
          const siteText= await loadText();

          //Log as sysadmin
          await webuser.login("systemadmin", "systemadmin");
          
          await siteText.getNextChild("dashboard").getNextChild("changepwd").setView(document.body, "chgadmnpwd");
          // Este texto mejor que lo tome de la base de datos
          new AlertMessage("<BR/>Database Populated saccesfully.<BR/><BR/><B>Please Change Administration Passwords.</B><BR/><BR/>", 6000).showAlert();
        });
        */