import config from './cfg/main.js';

//Change the size of a file
//var file = fileInput.files[0];  fd.append(filename, result, resultPropName, filename + ".png");
async function loadImgForm(formData) {
  //contentType undefined in porpouse so client will set it with boundary
  const fetchParams={
    method: 'post',
    body: formData,
    headers: userAuth
  };
  
  return fetch(config.uploadImagesUrlPath, fetchParams)
  .then(res => res.text())
  .then(resultTxt => {
    let result=null;
    try {
      result=JSON.parse(resultTxt);
    }
    catch(e){//To send errors from server in case the error catching methods at backend fail
      throw new Error(`Image loading. Response error: ${resultTxt}`);
    }
    if (result && typeof result=="object" && result.error==true) {
      throw new Error(`Image loading Message: ${result.message}`);
    }
    return result;
  })
}

export default function loadImg(imageName, newImageSmall, newImageBig) {
  const myFormData=new FormData();
  myFormData.append("image_file_small", newImageSmall, imageName);
  myFormData.append("image_file_big", newImageBig, imageName);
  return loadImgForm(myFormData);
}