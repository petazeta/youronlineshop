import {loadImg as loadImgBase} from '../../../catalog/admin/loadimg.mjs'
import {resizeImage} from '../../../catalog/admin/resizeimage.mjs'
import {performAddition} from '../../../admin/addition.mjs'
import {config} from '../../cfg.mjs'
import {getRoot as getSiteText} from '../../sitecontent.mjs'
import {selectorFromAttr} from '../../../frontutils.mjs'
import {getTemplate} from '../../layouts.mjs'

export async function setImgEdition(myItem, viewContainer){
  const editBut = selectorFromAttr(await getTemplate("buteditimage"), "data-but")
  selectorFromAttr(viewContainer, "data-butedit").appendChild(editBut)
  editBut.addEventListener('click', async event => {
    event.preventDefault()
    const myFrame = selectorFromAttr(await getTemplate("loadimg"), "data-card")
    selectorFromAttr(myFrame, "data-card-body").appendChild(await loadImgView(myItem))
    document.body.appendChild(myFrame)
  })
}

export async function loadImgView(myItem){
  const containerView = selectorFromAttr(await getTemplate("loadimg"), "data-container")
  selectorFromAttr(containerView, "data-close").addEventListener("click", (ev)=>{
    ev.preventDefault()
    document.getElementById("loadimg-card").parentElement.removeChild(document.getElementById("loadimg-card"))
  })
  const loadImageText = getSiteText().getNextChild("loadImg")
  loadImageText.getNextChild("headNote").setContentView(selectorFromAttr(containerView, "data-head-note"))
  loadImageText.getNextChild("file").setContentView(selectorFromAttr(containerView, "data-file"))

  const imagesContainer = selectorFromAttr(containerView, "data-items-images")
  const parentNode = myItem.getRelationship("itemsimages")  
  const tableContainer = selectorFromAttr(await getTemplate("imgloadlist"), "data-container")
  const sampleRow = selectorFromAttr(tableContainer, "data-row")
  const table = tableContainer.cloneNode()
  parentNode.childContainer = table
  for (const myImage of parentNode.children) {
    table.appendChild(await listView(myImage, sampleRow))
  }
  imagesContainer.appendChild(table)
  const myForm = selectorFromAttr(containerView, "data-form")
  const fileData = myForm.elements.fileData
  fileData.addEventListener("click", ev => {
    if (parentNode.children.length >= config.get("item-imgs-max")) {
      document.createElement("alert-element").showMsg("Please DELETE an image first") // *** Atención, este mensaje debería tomarse de la base de datos
      ev.preventDefault()
    }
  })
  fileData.addEventListener("change", async ()=>{
    fileData.disabled = true // Waiting start
    fileData.previousElementSibling.style.visibility = "visible"
    const newImageSmall = await resizeImage(fileData.files[0], 200)
    const newImageBig = await resizeImage(fileData.files[0], 520)
    // const childNode = parentNode.children.length ? parentNode.children[parentNode.children.length-1] : parentNode.createInstanceChild();
    // antes pasabamos {imgBlob: newImageSmall} a addition para que lo pasara a loadimglistimg
    // de esta forma no lo teniamos que actualizar, pero ahora seria mejor actualizarlo
    const newNode = parentNode.createInstanceChild()
    const skey = parentNode.getSysKey('sort_order')
    newNode.props[skey] = parentNode.children.length + 1
    await performAddition(newNode, undefined, async newNode => {
      await loadImg(`${newNode.props.id}.png`, newImageSmall, newImageBig)
      await newNode.loadRequest("edit my props", {values:{imagename: `${newNode.props.id}.png`}})
      updateItemImage(myItem)
      return await listView(newNode, sampleRow)
    })
    fileData.disabled = false // Waiting end
    fileData.previousElementSibling.style.visibility = "hidden"
    myForm.reset()
  })
  return containerView
}

// it is used by loadimglistimg.html
// At loadimglistimg.html imgBlog has value when it is loaded from a brand new loaded image
export async function listView(myNode, rowSample){ // myNode. imageNode
  const container = rowSample.cloneNode(true)
  myNode.firstElement = container
  // imgBlob sera antes, ahora ya no recibe esto, hay que revisarlo para que lo pueda actualizar correctamente
  const imageView = selectorFromAttr(container, "data-value")
  if (!myNode?.props.imagename)
    imageView.src = config.get("catalog-imgs-url-path") + `?size=small&image=${config.get("default-img")}&source=sample`
  else 
    imageView.src = config.get("catalog-imgs-url-path") + `?size=small&image=${myNode.props.imagename}`
  const butsWrapper = selectorFromAttr(container, "data-admnbuts")
  const myItem = myNode.getParent().getPartner()
  const {setDeletionButton} = await import("../../admin/deletion.mjs")
  await setDeletionButton(myNode, butsWrapper, ()=>updateItemImage(myItem))
  const {setChangePosButton} = await import("../../admin/changepos.mjs")
  await setChangePosButton(myNode, butsWrapper, ()=>updateItemImage(myItem))
  return container
}

async function loadImg(imageName, newImageSmall, newImageBig){
  return await loadImgBase(config.get("upload-imgs-url-path"), imageName, newImageSmall, newImageBig)
}

function updateItemImage(myNode){
  const container = myNode.firstElement
  const size = selectorFromAttr(container, "data-image-container").getAttribute("data-size")
  const myImage = myNode.getRelationship("itemsimages").getChild()
  const imageView = selectorFromAttr(container, "data-image-container data-value")
  if (!myImage?.props.imagename)
    imageView.src = config.get("catalog-imgs-url-path") + `?size=${size}&image=${config.get("default-img")}&source=sample`
  else 
    imageView.src = config.get("catalog-imgs-url-path") + `?size=${size}&image=${myImage.props.imagename}`
}