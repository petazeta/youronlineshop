<template>
  <td style="padding-right:1em;">
    <div class="adminsinglelauncher">
      <div class="form-group">
	<label class="form-label"></label>
	<script>thisElement.innerHTML=thisNode.editpropertyname;</script>
	<span></span>
	<script>
	  thisElement.innerHTML=thisNode.properties[thisNode.editpropertyname] || labelsRoot.getNextChild({name: "not located"}).getNextChild({name: "emptyvallabel"}).properties.innerHTML;
	</script>
	<div class="btrightedit"></div>
	<script>
	  var launcher=new NodeMale();
	  launcher.editpropertyname=thisNode.editpropertyname;
	  launcher.editelement=thisElement.parentElement.querySelector("span");
	  launcher.myNode=thisNode;
	  launcher.myContainer=thisElement;
	  launcher.myTp=document.getElementById("butedittp").content;
	  launcher.refreshView();
	</script>
      </div>
    </div>
  </td>
</template>