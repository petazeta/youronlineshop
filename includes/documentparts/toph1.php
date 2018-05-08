<div></div>
<template>
  <div class="adminsinglelauncher">
    <h1></h1>
    <script>
      thisElement.textContent=thisNode.properties.innerHTML || labelsRoot.getNextChild({name: "not located"}).getNextChild({name: "emptyvallabel"}).properties.innerHTML;
      if (thisNode.properties.innerHTML) document.title=thisNode.properties.innerHTML;
    </script>
    <div class="btrightedit"></div>
    <script>
      var addadminbutts=function(){
	var launcher=new NodeMale();
	launcher.editpropertyname="innerHTML";
	launcher.editelement=thisElement.parentElement.firstElementChild;
	launcher.myNode=thisNode;
	launcher.myContainer=thisElement;
	launcher.myTp=document.getElementById("butedittp").content;
	launcher.refreshView();
      }
      if (webuser.isWebAdmin()) {
	addadminbutts();
      }
      webuser.addEventListener("log", function() {
	if (!this.isWebAdmin()) {
	  thisElement.innerHTML='';
	}
	else {
	  addadminbutts();
	}
      });
    </script>
  </div>
</template>
<script>
webuser.addEventListener("loadses", function(){
  labelsRoot.getNextChild({"name":"top"}).getNextChild({"name":"headtitle"}).refreshView(document.querySelector("#topheadtitle div"), document.querySelector("#topheadtitle template"));
});
</script>