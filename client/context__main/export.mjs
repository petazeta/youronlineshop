import {getRoot as getSiteText} from "./sitecontent.mjs"
import {Node, Linker} from './nodes.mjs'
import {packing, unpacking} from '../../../shared/utils.mjs'
import {getLanguages, getLanguagesRoot} from './languages/languages.mjs'
import {getTemplate} from './layouts.mjs'
import {selectorFromAttr} from "../frontutils.mjs"
import {exportFormat} from "../../shared/utils.mjs"
import {prepareRequest, prepareMultiRequest} from "../request.mjs"
import {exportData} from "../export.mjs"

export async function exportView(){
  const expPath = getSiteText().getNextChild("dashboard").getNextChild("expimp")
  const expTp = await getTemplate("export")
  const expContainer = selectorFromAttr(expTp, "data-container")
  expPath.getNextChild("titexp").setContentView(selectorFromAttr(expContainer, "data-title"))
  expPath.getNextChild("noselection").setContentView(selectorFromAttr(expContainer, "data-nosel"))
  expPath.getNextChild("chkgeneral").setContentView(selectorFromAttr(expContainer, "data-chkgeneral"))
  expPath.getNextChild("chkgeneral").getNextChild("details").setContentView(selectorFromAttr(expContainer, "data-chkgeneral-details"))
  expPath.getNextChild("chkcatg").setContentView(selectorFromAttr(expContainer, "data-chkcatg"))
  expPath.getNextChild("chkcatg").getNextChild("details").setContentView(selectorFromAttr(expContainer, "data-chkcatg-details"))
  expPath.getNextChild("chkcheckout").setContentView(selectorFromAttr(expContainer, "data-chkcheckout"))
  expPath.getNextChild("chkcheckout").getNextChild("details").setContentView(selectorFromAttr(expContainer, "data-chkcheckout-details"))
  expPath.getNextChild("chklang").setContentView(selectorFromAttr(expContainer, "data-chklang"))
  expPath.getNextChild("chklang").getNextChild("details").setContentView(selectorFromAttr(expContainer, "data-chklang-details"))
  expPath.getNextChild("chkusers").setContentView(selectorFromAttr(expContainer, "data-chkusers"))
  expPath.getNextChild("chkusers").getNextChild("details").setContentView(selectorFromAttr(expContainer, "data-chkusers-details"))
  expPath.getNextChild("butexp").setContentView(selectorFromAttr(expContainer, "data-butexp"))
  expPath.getNextChild("chkentiredb").setContentView(selectorFromAttr(expContainer, "data-chk-entire-db"))
  expPath.getNextChild("chkentiredb").getNextChild("details").setContentView(selectorFromAttr(expContainer, "data-chk-entire-db-details"))
  const langContainer = selectorFromAttr(expContainer, "data-languages-list")
  const langSample = langContainer.firstElementChild.cloneNode(true)
  langContainer.removeChild(langContainer.firstElementChild)
  for (const lang of getLanguages()) {
    let langElm = langSample.cloneNode(true)
    lang.writeProp(selectorFromAttr(langElm, "data-lang-input"), "id", "value")
    lang.writeProp(selectorFromAttr(langElm, "data-lang-input"), "code", "name")
    lang.writeProp(selectorFromAttr(langElm, "data-lang-code"), "code")
    langContainer.appendChild(langElm)
  }
  const langRadioInput = selectorFromAttr(expContainer, "data-chklang-input")
  for (const radioInput of expContainer.getElementsByTagName("form")[0].dataoption) {
    radioInput.addEventListener("change", ev=>{
      if (langRadioInput.checked)
        langContainer.style.display = "block"
      else
        langContainer.style.display = "none"
    })
  }
  selectorFromAttr(expContainer, "data-butexp").addEventListener("click", async function(event){
    event.preventDefault()
    const expFunc = exportFunc.get(expContainer.getElementsByTagName("form")[0].dataoption.value)
    if (!expFunc) {
      document.createElement("alert-element").showMsg(expContainer.getElementsByTagName("form")[0].elements.noselection.value, 2000)
      return
    }
    if (expContainer.getElementsByTagName("form")[0].dataoption.value == "lang") {
      alert("no implem")
      return
    }
    expContainer.getElementsByTagName("form")[0].result.value = exportFormat(JSON.stringify(await expFunc()))
  })
  return expTp
}

export const exportFunc = new Map()

// To export data with lang content we first export the lang tree for first 2 levels: root and its rels (languages key). Then the root element tree to be exported with all langs.

exportFunc.set("menus", async ()=>{  
  const {getRoot: getPagesContent} = await import('./catalog/categories.mjs')
  return await exportData(getLanguages(), getPagesContent())
})

exportFunc.set("catalog", async ()=>{
  const {getRoot: getCategoriesContent} = await import('./catalog/categories.mjs')
  return await exportData(getLanguages(), getCategoriesContent())
})

exportFunc.set("checkout", async ()=>{
  // *** por que no funciona get my children?? no seria mejor hacer que funcionara y eliminar la necesidad de get my root?
  const shippingsRoot = (await new Linker("TABLE_SHIPPINGTYPES").loadRequest("get my root")).getChild()
  const paymentsRoot = (await new Linker("TABLE_PAYMENTTYPES").loadRequest("get my root")).getChild()
  return await exportData(getLanguages(), [shippingsRoot, paymentsRoot])
})

exportFunc.set("lang", async (selectedLangs)=>{
  //data from the structure
  const siteTextsData=await Node.requestMulti( "get my tree", Array(selectedLangs.children.length).fill(getSiteText().clone(null, 0)), selectedLangs.children.map(lang => new Object({extraParents: lang.getRelationship("siteelementsdata")})));
  const siteTexts=[];
  for (const i of siteTextsData.keys()) {
    // Request result is an array of arrays with the relationships. siteTextsData[0] => siteelements
    let siteText=getSiteText().clone(0, 0);
    siteText.load(unpacking(siteTextsData[i]));
    siteTexts[i]=await siteText.request("add my tree", null, true);
  }
  return {"languages": await Node.requestMulti("add my tree", selectedLangs.children, null, true), "trees": siteTexts};
});

exportFunc.set("users", async ()=>{
  const usertypemother=await new Linker("TABLE_USERSTYPES").loadRequest("get all my children", {filterProps: {type: "customer"}});
  const usertype=await usertypemother.getChild().loadRequest("get my tree", {deepLevel: 3});
  // No se hace usertype.getRelationship("users").loadRequest("get my tree") para no cargar los pedidos
  const users= usertype.getRelationship("users").children;
  const usersData=await Node.requestMulti("get my children", users.map(user=>user.getRelationship("usersdata")));
  const usersAddress=await Node.requestMulti("get my children", users.map(user=>user.getRelationship("address")));
  users.forEach((user, i)=>{
    user.getRelationship("usersdata").load(usersData[i]);
    user.getRelationship("addresses").load(usersAddress[i]);
  })
  return packing(usertype.getRelationship("users"));
});

exportFunc.set("db", async ()=>{
  const db = []
  db.push((await new Linker("TABLE_USERSTYPES").loadRequest("get my tree")).getChild())
  const {getRoot: getPagesContent} = await import('./pages/pages.mjs')
  db.push(await getPagesContent().clone(null, 0).loadRequest("get my tree"))
  const {getRoot: getSiteContent} = await import('./sitecontent.mjs')
  db.push(await getSiteContent().clone(null, 0).loadRequest("get my tree"))
  const {getRoot: getCategoriesContent} = await import('./catalog/categories.mjs')
  db.push(await getCategoriesContent().clone(null, 0).loadRequest("get my tree"))
  db.push((await new Linker("TABLE_SHIPPINGTYPES").loadRequest("get my tree")).getChild())
  db.push((await new Linker("TABLE_PAYMENTTYPES").loadRequest("get my tree")).getChild())
  const [langs] = await prepareRequest(getLanguagesRoot(), "add my tree") // languages root and children
  const [tree] = await prepareMultiRequest("add my tree", db)

  return {"languages": langs, "tree": tree}
})