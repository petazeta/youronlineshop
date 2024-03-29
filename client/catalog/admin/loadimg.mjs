import {authorizationToken} from "../../webuser/authorization.mjs"

export function loadImg(uploadImagesUrlPath, imageName, newImageSmall, newImageBig) {
  const myFormData = new FormData()
  myFormData.append("image_file_small", newImageSmall, imageName)
  myFormData.append("image_file_big", newImageBig, imageName)
  return loadImgForm(myFormData, uploadImagesUrlPath)
}

//Change the size of a file
//var file = fileInput.files[0];  fd.append(filename, result, resultPropName, filename + ".png");
async function loadImgForm(formData, uploadImagesUrlPath) {
  // * contentType undefined in purpose so client will set it with boundary
  const fetchParams = {
    method: 'post',
    body: formData,
    headers: {}
  }
  if (authorizationToken)
    Object.assign(fetchParams.headers, authorizationToken)

  return fetch(uploadImagesUrlPath, fetchParams)
  .then(res => {
    if (!res?.ok)
      throw new Error("Error server response")
    return res.text()
  })
  .then(resultTxt => {
    let result = null
    try {
      result = JSON.parse(resultTxt)
    }
    catch(e){//To send errors from server in case the error catching methods at backend fail
      throw new Error(`Image loading. Response error: ${resultTxt}`)
    }
    return result
  })
  .then(resultJSON => {
    if (resultJSON?.error==true) {
      throw new Error(`Image loading Message: ${result.message}`)
    }
    return resultJSON
  })
}