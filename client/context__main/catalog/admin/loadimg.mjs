// Introduces the context value uploadImagesUrlPath
import {loadImg as loadImgBase} from '../../../catalog/admin/loadimg.mjs'
import {resizeImage} from '../../../catalog/admin/resizeimage.mjs'
import {performAddition} from '../../../admin/addition.mjs'
import {config} from '../../cfg.mjs'
import {getRoot as getSiteText} from '../../sitecontent.mjs'
import {selectorFromAttr} from '../../../frontutils.mjs'
import {getTemplate} from '../../layouts.mjs'
import {rmBoxView} from "../../../rmbox.mjs"
//import {pathJoin} from '../../../urlutils.mjs'

export async function setImgEdition(myItem, viewContainer){
  const editBut = selectorFromAttr(await getTemplate("buteditimage"), "data-but")
  const butEditContainer = selectorFromAttr(viewContainer, "data-butedit")
  butEditContainer.appendChild(editBut)
  //new this.constructor.nodeConstructor().appendView(butEditView, "buteditimage", {setView: viewElement=>setImageEditButton(this, viewElement)})
  // falta lo de actualizar cuando termine la edicion ????
  editBut.addEventListener('click', async event => {
    event.preventDefault()
    const myFrame = selectorFromAttr(await getTemplate("loadimg"), "data-card")
    selectorFromAttr(myFrame, "data-card-body").appendChild(await loadImgView(myItem))
    document.body.appendChild(myFrame)
  })
}

export async function loadImgView(myItem){
  // esto se sigue haciendo asi? fijarse en delete
  //const loadImgView = await document.createElement("alert-element").showAlert("loadimg")
  //const loadImgView = await rmBoxView(getTemplate, "loadimg")
  const containerView = selectorFromAttr(await getTemplate("loadimg"), "data-container")

  selectorFromAttr(containerView, "data-close").addEventListener("click", (ev)=>{
    ev.preventDefault()
    document.getElementById("loadimg-card").parentElement.removeChild(document.getElementById("loadimg-card"))

    /*
    // Esto era para actualizar la imagen, hacerlo ahora de otra mandera

    thisElement.addEventListener("click",  ()=>{
      thisNode.hideAlert();
      /*
      import('./' + CLIENT_MODULES_PATH + 'availablestates.mjs')
      .then(({execUrlAction})=>{
        execUrlAction(window.location.search);
      });
      
    });
    */
  })
  const loadImageText = getSiteText().getNextChild("loadImg")
  loadImageText.getNextChild("headNote").setContentView(selectorFromAttr(containerView, "data-head-note"))
  loadImageText.getNextChild("file").setContentView(selectorFromAttr(containerView, "data-file"))

  const imagesContainer = selectorFromAttr(containerView, "data-items-images")
  const parentNode = myItem.getRelationship("itemsimages")
  // setChildrenView parece anticuado
  //parentNode.setChildrenView(imagesContainer, "loadimglistimg") // ojo! aqui estamos reemplazando .ChildTp de la antigua "itemthumbnail" con la nueva plantilla loadimglist
  
  const table = selectorFromAttr(await getTemplate("imgloadlist"), "data-container")
  parentNode.childContainer = table
  const sampleRow = selectorFromAttr(table, "data-row")
  for (const myImage of parentNode.children) {
    imagesContainer.appendChild(await listView(myImage, sampleRow))
  }
  const myForm = selectorFromAttr(containerView, "data-form")
  const fileData = myForm.elements.fileData
  fileData.addEventListener("change", async ()=>{
    if (parentNode.children.length>=config.get("item-imgs-max")) {
      // *** anticuado
      document.createElement("alert-element").showMsg("Please DELETE an image first") // *** Atención, este mensaje debería tomarse de la base de datos
      return
    }
    fileData.disabled = true //Waiting
    fileData.previousElementSibling.style.visibility = "visible"
    const newImageSmall = await resizeImage(fileData.files[0], 200)
    const newImageBig = await resizeImage(fileData.files[0], 520)
    // const childNode = parentNode.children.length ? parentNode.children[parentNode.children.length-1] : parentNode.createInstanceChild();
    // antes pasabamos {imgBlob: newImageSmall} a addition para que lo pasara a loadimglistimg
    // de esta forma no lo teniamos que actualizar, pero ahora seria mejor actualizarlo
    const newNode = parentNode.createInstanceChild()
    
    //const newNode = await addition(undefined, undefined, parentNode) // falta lo de sort_order ??
    await performAddition(newNode)
    newNode.props.imagename = `${newNode.props.id}.png` // anular esto ??
    await newNode.request("edit my props", {values:{imagename: newNode.props.imagename}})
    const loadResult = await loadImg(newNode.props.imagename, newImageSmall, newImageBig)
    newNode.dispatchEvent("loadImage")
    fileData.disabled = false //Waiting
    fileData.previousElementSibling.style.visibility = "hidden"
    myForm.reset()
    // Aqui faltaría actualizar la vista de la imagen en el item.html o itemlarge.html
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
  /*
  if (imgBlob) {
    const objectURL = URL.createObjectURL(imgBlob)
    imageView.src = objectURL
  }
  */
  if (!myNode?.props.imagename)
    imageView.src = config.get("catalog-imgs-url-path") + `?size=small&image=${config.get("default-img")}&source=sample`
  else 
    imageView.src = config.get("catalog-imgs-url-path") + `?size=small&image=${myNode.props.imagename}`
  const butsWrapper = selectorFromAttr(container, "data-admnbuts")
  // new myNode.constructor.nodeConstructor().appendView(butsWrapper, "butdelete", {delNode: myNode})
  // new myNode.constructor.nodeConstructor().appendView(butsWrapper, "butchpos", {chNode: myNode, position: "vertical"})
  const {setDeletionButton} = await import("../../admin/deletion.mjs")
  await setDeletionButton(myNode, butsWrapper)
  const {setChangePosButton} = await import("../../admin/changepos.mjs")
  await setChangePosButton(myNode, butsWrapper)
  return container
}

function loadImg(imageName, newImageSmall, newImageBig){
  loadImgBase(config.get("upload-imgs-url-path"), imageName, newImageSmall, newImageBig)
}