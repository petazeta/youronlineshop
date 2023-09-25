// Introduces the context value uploadImagesUrlPath
import loadImgBase from '../../../catalog/admin/loadimg.mjs'
import {resizeImage} from '../../../catalog/admin/resizeimage.mjs'
import addition from '../../admin/addition.mjs'
import configValues from '../../cfg/main.mjs'
import {getRoot as getSiteText} from '../../sitecontent.mjs'
import {selectorFromAttr} from '../../../frontutils.mjs'

function loadImg(imageName, newImageSmall, newImageBig){
  loadImgBase(configValues.uploadImagesUrlPath, imageName, newImageSmall, newImageBig)
}

export function setButEditImgView(myItem, viewElement){
  const myButton=selectorFromAttr(viewElement, "data-button")
  myButton.addEventListener('click', async event => {
    event.preventDefault()
    document.body.appedChild(await loadImgView())
  })
}

export async function loadImgView(myItem){
  const loadImgView = await document.createElement("alert-element").showAlert("loadimg")
  const containerView = selectorFromAttr(loadImgView, "data-container")
  selectorFromAttr(containerView, "data-close").addEventListener("click", (ev)=>{
    ev.preventDefault()
    loadImgView.hideAlert()
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
  const loadImageText=getSiteText().getNextChild("loadImg")
  loadImageText.getNextChild("headNote").setContentView(selectorFromAttr(containerView, "data-head-note"))
  loadImageText.getNextChild("file").setContentView(selectorFromAttr(viewElement, "data-file"))

  const imagesContainer=selectorFromAttr(viewElement, "data-items-images")
  const parentNode=myItem.getRelationship("itemsimages")
  
  parentNode.setChildrenView(imagesContainer, "loadimglisting") // ojo! aqui estamos reemplazando .ChildTp de la antigua "itemthumbnail" con la nueva plantilla loadimglist
  const myForm=selectorFromAttr(viewElement, "data-id", "load-img-form")
  const fileData=myForm.elements.fileData
  fileData.addEventListener("change", async ()=>{
    if (parentNode.children.length>=configValues.itemImagesMax) {
      new AlertMessage("Please DELETE an image first").showAlert() // Atención, este mensaje debería tomarse de la base de datos
      return
    }
    fileData.disabled=true //Waiting
    fileData.previousElementSibling.style.visibility="visible"
    const newImageSmall=await resizeImage(fileData.files[0], 200)
    const newImageBig=await resizeImage(fileData.files[0], 520)
    // const childNode = parentNode.children.length ? parentNode.children[parentNode.children.length-1] : parentNode.createInstanceChild();
    // antes pasabamos {imgBlob: newImageSmall} a addition para que lo pasara a loadimglistimg
    // de esta forma no lo teniamos que actualizar, pero ahora seria mejor actualizarlo
    const newNode=await addition(undefined, undefined, parentNode) // falta lo de sort_order ??
    newNode.props.imagename=`${newNode.props.id}.png` // anular esto
    await newNode.request("edit my props", {values:{imagename: newNode.props.imagename}})
    const loadResult = await loadImg(newNode.props.imagename, newImageSmall, newImageBig)
    newNode.dispatchEvent("loadImage")
    fileData.disabled=false //Waiting
    fileData.previousElementSibling.style.visibility="hidden"
    myForm.reset()
    // Aqui faltaría actualizar la vista de la imagen en el item.html o itemlarge.html
  })
}

// it is used by loadimglistimg.html
// At loadimglistimg.html imgBlog has value when it is loaded from a brand new loaded image
export async function setLoadImgListImgView(itemImage, viewElement, imgBlob){
  // imgBlob sera antes, ahora ya no recibe esto, hay que revisarlo para que lo pueda actualizar correctamente
  const myImageView=selectorFromAttr(viewElement, "data-id", "value")
  if (imgBlob) {
    const objectURL = URL.createObjectURL(imgBlob)
    myImageView.src = objectURL
  }
  else {
    const myImageName=itemImage.props.imagename || configValues.defaultImg
    myImageView.src=pathJoin(configValues.catalogImagesUrlPath, 'small', myImageName)
  }
  const butsWrapper=selectorFromAttr(viewElement, "data-id", "admnbuts")
  new itemImage.constructor.nodeConstructor().appendView(butsWrapper, "butdelete", {delNode: itemImage})
  new itemImage.constructor.nodeConstructor().appendView(butsWrapper, "butchpos", {chNode: itemImage, position: "vertical"})
}
