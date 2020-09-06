<template>
  <template>
    <div class="alert alertmsg">
      <form action="uploadfile.php" enctype="multipart/form-data" id="form-file">
	<table class="mytable">
	  <tr>
	    <td>
              <span></span>
              <script>
                //Normalize
                var launcher=thisNode;
                var labelNode=launcher.labelNode;
                labelNode.getNextChild({"name":"headNote"}).getRelationship({name:"domelementsdata"}).getChild().writeProperty(thisElement);
                //adding the edition pencil
                var launcher = new Node();
                launcher.thisNode = labelNode;
                launcher.editElement = thisElement;
                launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
              </script>
	    </td>
	  </tr>
	  <tr>
	    <td>
	      <div class="form-group">
		<label class="form-label"></label>
                <script>
                  //Normalize
                  var launcher=thisNode;
                  var labelNode=launcher.labelNode;
                  labelNode.getNextChild({"name":"file"}).getRelationship({name:"domelementsdata"}).getChild().writeProperty(thisElement);
                  //adding the edition pencil
                  var launcher = new Node();
                  launcher.thisNode = labelNode;
                  launcher.editElement = thisElement;
                  launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
                </script>
		<input name="fileData" type="file" style="width:100%">
	      </div>
	    </td>
	  </tr>
	  <tr>
	    <td>
	      <table class="mytable">
		<tr>
		  <td>
		    <input type="button" value="Close" name="exit" class="form-btn">
		  </td>
		  <td><input type="submit" value="Send" class="form-btn"></td>
		</tr>
	      </table>
	    </td>
	  </tr>
	</table>
      </form>
      <script>
	//normalize
	var launcher=thisNode;
	var thisNode=launcher.thisNode;
	var newImageSmall=[];
        var newImageBig=[];
	thisElement.elements.exit.onclick=function(){
	  launcher.hidealert();
	}
	thisElement.elements.fileData.addEventListener("change", function() {
	  resizeImage(this.files[0], 200, newImageSmall);
          resizeImage(this.files[0], 520, newImageBig);
	});
	thisElement.addEventListener("submit", function(ev) {
	  ev.preventDefault();
	  var fileName=thisNode.fileName;
	  var myFormDataSmall=new FormData();
          var myFormDataBig=new FormData();
	  myFormDataSmall.append(fileName, newImageSmall[0], fileName + ".png");
          myFormDataSmall.append('fileSize', 'small');
	  myFormDataSmall.action=this.action;
	  myFormDataBig.append(fileName, newImageBig[0], fileName + ".png");
          myFormDataBig.append('fileSize', 'big');
	  myFormDataBig.action=this.action;
	  thisNode.loadfromhttp(myFormDataSmall).then(function(myNode){
            thisNode.loadfromhttp(myFormDataBig).then(function(){
              launcher.hidealert();
              thisNode.dispatchEvent("loadImage");
            });
	  });
	});
      </script>
    </div>
  </template>
  <script>
    //normalize
    var myalert=new Alert();
    myalert.thisNode=thisNode;
    myalert.labelNode=thisNode.labelNode;
    myalert.showalert(null, thisElement);
  </script>
</template>
