<template>
  <template>
    <div class="alert alertmsg">
      <form action="uploadfile.php" enctype="multipart/form-data" id="form-file">
	<table class="mytable">
	  <tr>
	    <td>
	      The image will be resized to fit the frame
	    </td>
	  </tr>
	  <tr>
	    <td>
	      <div class="form-group">
		<label class="form-label">Archivo de imagen:</label>
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
	var newImage=[];
	thisElement.elements.exit.onclick=function(){
	  launcher.hidealert();
	}
	thisElement.elements.fileData.addEventListener("change", function() {
	  resizeImage(this.files[0], 132, newImage);
	});
	thisElement.addEventListener("submit", function(ev) {
	  ev.preventDefault();
	  var fileName=thisNode.fileName;
	  var myFormData=new FormData();
	  myFormData.append(fileName, newImage[0], fileName + ".png");
	  myFormData.action=this.action;
	  thisNode.loadfromhttp(myFormData, function(){
	    launcher.hidealert();
	    thisNode.dispatchEvent("loadImage");
	  });
	});
      </script>
    </div>
  </template>
  <script>
    //normalize
    var myalert=new Alert();
    myalert.thisNode=thisNode;
    myalert.showalert(null, thisElement);
  </script>
</template>
