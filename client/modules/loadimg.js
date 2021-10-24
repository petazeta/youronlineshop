import config from './config.js';
//Change the size of a file
//var file = fileInput.files[0];  fd.append(filename, result, resultPropName, filename + ".png");
async function loadImg(imgNode, action, formData, fileSize) {
  const reducedData=await imgNode.request(action, null, true);
  formData.append('parameters', JSON.stringify({nodeData: reducedData.avoidrecursion(), action: action, fileSize: fileSize}));
  let method='post';
  let contentType; //contentType undefined in porpouse so client will set it with boundary
  const fetchParams={
    method: method,
    headers: {},
    body: formData,
  };
  if (webuser.getAuthorizationToken()) fetchParams.headers={...fetchParams.headers, ...webuser.getAuthorizationToken()};
  return fetch(config.uploadFilePath, fetchParams)
  .then(res => res.text())
  .then(resultTxt => {
    let result=null;
    try {
      result=JSON.parse(resultTxt);
    }
    catch(e){//To send errors from server in case the error catching methods at backend fail
      throw new Error(`Image loading: ${action}. Response error: ${resultTxt}`);
    }
    if (result && typeof result=="object" && result.error==true) {
      throw new Error(`Image loading: ${action} Message: ${result.message}`);
    }
    return result;
  })
}

export default function loadImgBigSmall(imgNode, newImageSmall, newImageBig) {
  const myFormDataSmall=new FormData();
  myFormDataSmall.append("image_file", newImageSmall, imgNode.props.imagename);
  const myFormDataBig=new FormData();
  myFormDataBig.append("image_file", newImageBig, imgNode.props.imagename);
  return loadImg(imgNode, "add my tree", myFormDataSmall, "small")
  .then(result => {
    if (result!=true) throw new Error("uploading fail");
    return loadImg(imgNode, "add my tree", myFormDataBig, "big");
  })
  .then(result => {
    imgNode.dispatchEvent("loadImage");
    return result;
  });
}