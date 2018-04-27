<template id="buteditimgtp">
  <a title="Insert Image" href="" style="" class="singleadminedit butedit">
    <img src="includes/css/images/pen.png"/>
  </a>
  <script>
    //normalize
    var launcher=thisNode;
    var thisNode=launcher.myNode;
    thisElement.onclick=function() {
      var myalert=new Alert();
      myalert.myNode=thisNode;
      myalert.myTp=thisElement.parentElement.querySelector("template").content;
      myalert.showalert();
      return false;
    }
  </script>
  <template>
    <div class="alert">
      <form action="uploadfile.php" enctype="multipart/form-data">
	<table class="mytable">
	  <tr>
	    <td colspan="3">
	      The image will be resized to fit the frame
	      <input type="hidden" name="imagesize" id="imagesize" value="132">
	    </td>
	  </tr>
	  <tr>
	    <td colspan="3">
	      <div class="form-group">
		<label class="form-label">Archivo de imagen:</label>
		<input name="Filedata" type="file">
	      </div>
	    </td>
	  </tr>
	  <tr>
	    <td colspan="3" id="fileDisplayArea">
	    </td>
	  </tr>
	  <tr>
	    <td colspan="3">
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
	var thisNode=launcher.myNode;
	thisElement.onsubmit=function() {
	  var myresult=new NodeMale();
	  this.myFormData.action=this.action;
	  myresult.loadfromhttp(this.myFormData, function(){
	  var myalertmsg="";
	  if (this.extra && this.extra.error==true) {
	    myalertmsg="error uploading file";
	  }
	  else {
	    myalertmsg="upload image product id " + thisNode.properties.id + " ok";
	  }
	  myalert.load({properties:{alertmsg: myalertmsg, timeout:2000}});
	  myalert.showalert();
	  
	  //Now we need to update item image column
	  if (myresult.error!=true) {
	    var updatedone=function(){
	      //Falta aqui refrescar la imagen, esto no parece tan sencillo porque desconocemos el container
	      launcher.hidealert();
	      thisNode.parentNode.partnerNode.getMyDomNodes()[0].querySelector("a").click();
	    }
	    var formEdit=thisElement.parentElement.querySelector("template").content.querySelector("form").cloneNode(true);
	    thisNode.setView(formEdit);
	    thisElement.insertBefore(formEdit, thisElement.querySelector("template"));
	    var editfield=document.createElement("input");
	    editfield.name="image";
	    editfield.value="file_"+thisNode.properties.id+ ".png";
	    editfield.type="hidden";
	    formEdit.appendChild(editfield);
	    var myresultedit=new NodeMale();
	    myresultedit.loadfromhttp(formEdit, updatedone);
	  }
	    //submitted
	});
	//launcher.hidealert();
	return false;
      }
      thisElement.elements.exit.onclick=function(){
	launcher.hidealert();
      }
      
      
      
var myForm=thisElement;

var fileInput = myForm.Filedata;

fileInput.addEventListener("change", function() {
  var file = fileInput.files[0];
  var imageType = /image.*/;

  if (file.type.match(imageType)) {
    var reader = new FileReader();
    reader.onload = function() {
      // Create a new image.
      var img = new Image();
      // Set the img src property using the data URL.
      img.src = reader.result;
      img.onload = function() {
        var image=this;
        var imageSize=myForm.elements.imagesize;

        var fd = new FormData();
        var max_width=0;

          max_width=imageSize.value;
           width = image.width;
           height = image.height;
           if (width > max_width) {
            height *= max_width / width;
            width = max_width;
          }
          var canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          
          canvas.getContext("2d").drawImage(image, 0, 0, width, height);
          var dataUrl = canvas.toDataURL("image/png");
          var blob = dataURItoBlob(dataUrl);

          fd.append("file_"+thisNode.properties.id, blob, "file_"+thisNode.properties.id + ".png");

        fd.append("item_id", thisNode.properties.id);
        fd.append("folder", "small");
        myForm.myFormData=fd;

        function dataURItoBlob(dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(",")[0].indexOf("base64") >= 0)
          byteString = atob(dataURI.split(",")[1]);
            else
          byteString = unescape(dataURI.split(",")[1]);

            // separate out the mime component
            var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ia], {type:mimeString});
        }
      };
    }
  reader.readAsDataURL(file); 
  }
  else {
    fileDisplayArea.innerHTML = "File not supported!";
  }
});
	</script>
	<template>
	  <form action="dbrequest.php">
	    <input type="hidden" name="json"/>
	    <script>
	      var mydata=new NodeMale();
	      mydata.properties.id=thisNode.properties.id;
	      mydata.parentNode=new NodeFemale();
	      mydata.parentNode.loadasc(thisNode.parentNode, 1);
	      thisElement.value=JSON.stringify(mydata);
	    </script>
	    <input type="hidden" name="parameters" value="" data-js='thisElement.value=JSON.stringify({action:"edit my properties", user_id: webuser.properties.id});'/>
	  </form>
	</template>
    </template>
  </div>
</template>