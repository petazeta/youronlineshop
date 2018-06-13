<template>
  <div style="padding-right:1em;">
    <div class="adminlauncher adminsinglelauncher">
      <div class="form-group">
	<label class="form-label"></label>
	<script>thisElement.innerHTML=thisNode.editpropertyname;</script>
	<span></span>
	<script>
	  thisElement.innerHTML=thisNode.properties[thisNode.editpropertyname] || emptyValueText;
	</script>
	<div class="btrightedit"></div>
	<script>
	  var admnlauncher=new NodeMale();
	  admnlauncher.myNode=thisNode;
	  admnlauncher.buttons=[];
	  if (!(thisNode.parentNode.properties.childtablelocked==1)) {
	    admnlauncher.buttons.push({
	      template: document.getElementById("butedittp"),
	      args: {editpropertyname:thisNode.editpropertyname, allowedHTML:false, editelement:thisElement.parentElement.querySelector("span")}
	    });
	  }
	  admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
	</script>
      </div>
    </div>
  </div>
</template>