export default async function imageEditFunc(myParams){
  //myParams=>myNode, labelNode, imageElement
  //We have to produce a new fileName for when file edition
  let fileName= this.props.image;
  if (fileName && fileName.includes('_')) {
    //Adding next _number for the image
    let previousNum=0;
    if (fileName.match(/_\d/g)) {
      previousNum=fileName.match(/\d+\./)[0];
    }
    previousNum++;
    fileName="file_" + this.props.id + '_' + previousNum;
  }
  else fileName="file_" + this.props.id;
  const {Alert, AlertMessage}=await import('./alert.js');
  (new Alert()).showAlert("loadimg", {myNode: myParams.myNode, labelNode: myParams.labelNode, fileName: fileName});
  this.addEventListener("loadImage", function() {
    if (this.error==true) {
      const loadErrorMsg=myParams.labelNode.getNextChild("loadError").getRelationship("domelementsdata").getChild().props.value;
      (new AlertMessage(loadErrorMsg, 3000)).showAlert();
    }
    else {
      myParams.imageElement.setAttribute('data-src', fileName + '.png');
      this.dispatchEvent("finishAutoEdit");
    }
  });
}