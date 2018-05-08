<div></div>
<template>
  <div class="adminsinglelauncher">
    <h2></h2>
    <script>
      thisElement.textContent=thisNode.properties.innerHTML || labelsRoot.getNextChild({name: "not located"}).getNextChild({name: "emptyvallabel"}).properties.innerHTML;
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
  var headtt=labelsRoot.getNextChild({"name":"top"}).getNextChild({"name":"headsubtitle"});
  headtt.refreshView(document.querySelector("#topheadsubtitle div"), document.querySelector("#topheadsubtitle template"));
});
</script>