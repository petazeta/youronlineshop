<template>
  <script>
    //Normalize
    var itemNode=thisNode.args.itemNode;
    var imageElement=thisNode.args.imageElement;
    var btposition=thisNode.args.btposition;
    
    var launcher = new Node();
    launcher.editable=itemNode.parentNode.editable;
    launcher.btposition=btposition;
    launcher.thisNode = itemNode;
    launcher.editElement = imageElement;
    launcher.thisProperty="image";
    launcher.thisAttribute="data-src";
    
    var autoeditFunc=function(){
      var autolauncher=new Node();
      autolauncher.labelNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name: "loadImg"});
      //We have to produce a new fileName for when file edition
      var fileName= itemNode.properties.image;
      if (fileName && fileName.search('_')!=-1) {
        //Adding next _number for the image
        var previousNum=0;
        if (fileVerMatch=fileName.match(/_\d/g).length==2) {
          previousNum=fileName.match(/\d+\./)[0];
        }
        previousNum++
        fileName="file_" + itemNode.properties.id + '_' + previousNum;
      }
      else fileName="file_" + itemNode.properties.id;
      autolauncher.fileName=fileName;
      autolauncher.appendThis(document.getElementById('centralcontent'), "templates/loadimg.php");
      autolauncher.addEventListener("loadImage",function(){
        if (this.extra && this.extra.error==true) {
          var loadError=this.labelNode.getNextChild({name:"loadError"});
          var loadErrorMsg=loadError.getRelationship("domelementsdata").getChild().properties.value;
          alert(loadErrorMsg);
        }
        else {
          imageElement.setAttribute('data-src', this.fileName + '.png');
          itemNode.dispatchEvent("finishAutoEdit");
        }
      });
    };
    launcher.autoeditFunc=autoeditFunc;
    launcher.appendThis(imageElement.parentElement, "templates/addbutedit.php");
  </script>
</template>